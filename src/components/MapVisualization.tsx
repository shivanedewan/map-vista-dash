import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapVisualizationProps {
  data: any[];
  selectedRecord?: any;
}

export function MapVisualization({ data, selectedRecord }: MapVisualizationProps) {
  const [latField, setLatField] = useState<string>("");
  const [lonField, setLonField] = useState<string>("");
  const [plotData, setPlotData] = useState<any[]>([]);

  const fields = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const handlePlot = () => {
    if (latField && lonField) {
      setPlotData(data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Select onValueChange={setLatField} value={latField}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Latitude Field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map(field => (
              <SelectItem key={field} value={field}>{field}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setLonField} value={lonField}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Longitude Field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map(field => (
              <SelectItem key={field} value={field}>{field}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handlePlot}>Plot Data</Button>
      </div>
      <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="/tiles/{z}/{x}/{y}.png"
        />
        {plotData.map(record => (
          <Marker key={record.id} position={[record[latField], record[lonField]]}>
            <Popup>
              <pre>{JSON.stringify(record, null, 2)}</pre>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}