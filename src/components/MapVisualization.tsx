import { useEffect, useRef, useState } from "react";
import { MapPin, Settings, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MapVisualizationProps {
  indexName: string;
  data: any[];
  selectedRecord?: any;
}

// Sample coordinate data for different indexes
const getCoordinatesFromData = (indexName: string, data: any[]) => {
  return data.map(record => ({
    id: record.id,
    lat: record.latitude,
    lng: record.longitude,
    label: record.name || record.storeName || record.trackingId || record.id,
    details: record
  })).filter(point => point.lat && point.lng);
};

export function MapVisualization({ indexName, data, selectedRecord }: MapVisualizationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [map, setMap] = useState<any>(null);
  
  const coordinates = getCoordinatesFromData(indexName, data);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    // Dynamically import Mapbox GL
    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = mapboxToken;
      
      const mapInstance = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: coordinates.length > 0 ? [coordinates[0].lng, coordinates[0].lat] : [0, 0],
        zoom: coordinates.length > 1 ? 2 : 10
      });

      // Add navigation controls
      mapInstance.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Add markers for each coordinate
      coordinates.forEach((point, index) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(data:image/svg+xml;charset=utf-8,' + 
          encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
              <circle cx="10" cy="10" r="4" fill="white"/>
            </svg>
          `) + ')';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.backgroundSize = '100%';
        el.style.cursor = 'pointer';

        // Create popup
        const popup = new mapboxgl.default.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h4 class="font-semibold text-sm">${point.label}</h4>
            <p class="text-xs text-gray-600">Lat: ${point.lat.toFixed(4)}, Lng: ${point.lng.toFixed(4)}</p>
          </div>
        `);

        // Add marker to map
        new mapboxgl.default.Marker(el)
          .setLngLat([point.lng, point.lat])
          .setPopup(popup)
          .addTo(mapInstance);
      });

      // Fit bounds to show all markers if multiple points
      if (coordinates.length > 1) {
        const bounds = new mapboxgl.default.LngLatBounds();
        coordinates.forEach(point => bounds.extend([point.lng, point.lat]));
        mapInstance.fitBounds(bounds, { padding: 50 });
      }

      setMap(mapInstance);
      setShowTokenInput(false);

      return () => mapInstance.remove();
    }).catch(error => {
      console.error('Error loading Mapbox:', error);
    });
  }, [mapboxToken, coordinates]);

  // Focus on selected record
  useEffect(() => {
    if (map && selectedRecord && selectedRecord.latitude && selectedRecord.longitude) {
      map.flyTo({
        center: [selectedRecord.longitude, selectedRecord.latitude],
        zoom: 12,
        duration: 1000
      });
    }
  }, [map, selectedRecord]);

  if (showTokenInput) {
    return (
      <Card className="p-6 text-center space-y-4">
        <div className="space-y-2">
          <MapPin className="h-12 w-12 mx-auto text-data-blue" />
          <h3 className="text-lg font-semibold">Map Visualization</h3>
          <p className="text-muted-foreground text-sm">
            Enter your Mapbox access token to visualize coordinate data
          </p>
        </div>
        
        <div className="max-w-md mx-auto space-y-3">
          <Input
            placeholder="Enter Mapbox access token..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            type="password"
          />
          <Button 
            onClick={() => setMapboxToken(mapboxToken)}
            disabled={!mapboxToken}
            className="w-full"
          >
            Initialize Map
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>Get your token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a></p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Geographic Visualization</h3>
          <Badge variant="secondary" className="text-xs">
            {coordinates.length} points
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Layers className="h-4 w-4 mr-1" />
            Layers
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border bg-muted"
        />
        {coordinates.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-lg">
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No coordinate data available</p>
            </div>
          </div>
        )}
      </div>

      {selectedRecord && selectedRecord.latitude && selectedRecord.longitude && (
        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-data-green" />
            <span className="text-sm font-medium">Selected Location:</span>
            <span className="text-sm text-muted-foreground">
              {selectedRecord.latitude.toFixed(4)}, {selectedRecord.longitude.toFixed(4)}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}