import math
import os
import requests
import time

# --- Configuration ---
# Bounding box for India (includes J&K and surrounding areas for context)
# Format: [Min Longitude, Min Latitude, Max Longitude, Max Latitude]
BOUNDING_BOX = [68.0, 6.0, 98.0, 37.0] 

# Zoom levels to download. 
# Warning: A max zoom of 14 is already large. 15+ will be many gigabytes.
MIN_ZOOM = 0
MAX_ZOOM = 14

# This must match the path used in your MapVisualization component
OUTPUT_DIR = "public/tiles"

# Standard OpenStreetMap tile server
TILE_SERVER_URL = "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"

# It's good practice to set a User-Agent
HEADERS = {
    'User-Agent': 'MapVista-Dashboard-Tile-Downloader/1.0'
}

def deg_to_tile_num(lat_deg, lon_deg, zoom):
    """Converts latitude and longitude to tile numbers."""
    lat_rad = math.radians(lat_deg)
    n = 2.0 ** zoom
    xtile = int((lon_deg + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return (xtile, ytile)

def download_tiles():
    """Downloads tiles within the specified bounding box and zoom levels."""
    print("--- Starting Map Tile Download for India ---")
    print(f"Bounding Box: {BOUNDING_BOX}")
    print(f"Zoom Levels:  {MIN_ZOOM} to {MAX_ZOOM}")
    print(f"Output To:    {OUTPUT_DIR}")
    print("-" * 45)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    total_tiles_to_process = 0

    # First, calculate the total number of tiles
    for zoom in range(MIN_ZOOM, MAX_ZOOM + 1):
        top_left_x, top_left_y = deg_to_tile_num(BOUNDING_BOX[3], BOUNDING_BOX[0], zoom)
        bottom_right_x, bottom_right_y = deg_to_tile_num(BOUNDING_BOX[1], BOUNDING_BOX[2], zoom)
        num_tiles_zoom = (bottom_right_x - top_left_x + 1) * (bottom_right_y - top_left_y + 1)
        total_tiles_to_process += num_tiles_zoom
    
    print(f"Approximate total tiles to check/download: {total_tiles_to_process}")
    print("This may take a very long time.")
    
    downloaded_count = 0
    for zoom in range(MIN_ZOOM, MAX_ZOOM + 1):
        top_left_x, top_left_y = deg_to_tile_num(BOUNDING_BOX[3], BOUNDING_BOX[0], zoom)
        bottom_right_x, bottom_right_y = deg_to_tile_num(BOUNDING_BOX[1], BOUNDING_BOX[2], zoom)
        
        num_tiles_zoom = (bottom_right_x - top_left_x + 1) * (bottom_right_y - top_left_y + 1)
        print(f"\nProcessing Zoom Level: {zoom} ({num_tiles_zoom} tiles)")
        
        zoom_dir = os.path.join(OUTPUT_DIR, str(zoom))
        os.makedirs(zoom_dir, exist_ok=True)
        
        tile_count_in_zoom = 0
        for x in range(top_left_x, bottom_right_x + 1):
            x_dir = os.path.join(zoom_dir, str(x))
            os.makedirs(x_dir, exist_ok=True)
            
            for y in range(top_left_y, bottom_right_y + 1):
                tile_count_in_zoom += 1
                tile_path = os.path.join(x_dir, f"{y}.png")
                
                if os.path.exists(tile_path):
                    continue

                url = TILE_SERVER_URL.format(z=zoom, x=x, y=y)
                try:
                    response = requests.get(url, headers=HEADERS, stream=True, timeout=20)
                    response.raise_for_status()
                    
                    with open(tile_path, 'wb') as f:
                        f.write(response.content)
                    
                    downloaded_count += 1
                    print(f"\r  -> Downloaded {downloaded_count} new tiles. Current: {tile_count_in_zoom}/{num_tiles_zoom}", end="")
                    
                    # Be respectful to the tile server by adding a small delay
                    time.sleep(0.05) 

                except requests.exceptions.RequestException as e:
                    print(f"\n[Error] Could not download {url}: {e}")

    print(f"\n\n{''.center(45, '-')}")
    print("Tile download process finished!")
    print(f"Total new tiles downloaded: {downloaded_count}")
    print(f"All tiles are saved in the '{OUTPUT_DIR}' directory.")

if __name__ == "__main__":
    download_tiles()