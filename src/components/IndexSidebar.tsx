import { useState } from "react";
import { Search, Database, MapPin, Calendar, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IndexData {
  id: string;
  name: string;
  docCount: number;
  size: string;
  hasGeoData: boolean;
  lastUpdated: string;
  category: string;
}

const sampleIndexes: IndexData[] = [
  {
    id: "user-locations",
    name: "user-locations-2024",
    docCount: 15420,
    size: "2.1 GB",
    hasGeoData: true,
    lastUpdated: "2024-01-20",
    category: "Users"
  },
  {
    id: "delivery-tracking",
    name: "delivery-tracking",
    docCount: 8930,
    size: "1.5 GB",
    hasGeoData: true,
    lastUpdated: "2024-01-19",
    category: "Logistics"
  },
  {
    id: "store-analytics",
    name: "store-analytics",
    docCount: 25680,
    size: "3.8 GB",
    hasGeoData: true,
    lastUpdated: "2024-01-18",
    category: "Retail"
  },
  {
    id: "weather-data",
    name: "weather-stations",
    docCount: 5240,
    size: "850 MB",
    hasGeoData: true,
    lastUpdated: "2024-01-17",
    category: "Environmental"
  }
];

interface IndexSidebarProps {
  onIndexSelect: (index: IndexData) => void;
  selectedIndex: IndexData | null;
}

export function IndexSidebar({ onIndexSelect, selectedIndex }: IndexSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIndexes = sampleIndexes.filter(index =>
    index.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    index.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Users": return Users;
      case "Logistics": return MapPin;
      case "Retail": return Database;
      case "Environmental": return Calendar;
      default: return Database;
    }
  };

  return (
    <div className="w-80 bg-dashboard-sidebar border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Indexes</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search indexes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredIndexes.map((index) => {
          const Icon = getCategoryIcon(index.category);
          return (
            <Card
              key={index.id}
              className={cn(
                "p-3 cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedIndex?.id === index.id 
                  ? "bg-primary/10 border-primary shadow-sm" 
                  : "hover:bg-muted/50"
              )}
              onClick={() => onIndexSelect(index)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-data-blue" />
                  <h3 className="font-medium text-sm text-foreground truncate">
                    {index.name}
                  </h3>
                </div>
                {index.hasGeoData && (
                  <MapPin className="h-3 w-3 text-data-green" />
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{index.docCount.toLocaleString()} docs</span>
                  <span>{index.size}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {index.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {index.lastUpdated}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}