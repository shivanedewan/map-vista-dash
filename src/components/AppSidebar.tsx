import { useState } from "react";
import { Search, Database, MapPin, Calendar, Users, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface AppSidebarProps {
  onIndexSelect: (index: IndexData) => void;
  selectedIndex: IndexData | null;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ onIndexSelect, selectedIndex, isCollapsed, onToggle }: AppSidebarProps) {
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
    <div className={cn(
      "glass-card border-r border-border h-full flex flex-col transition-smooth",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggle}
            className="hover-3d glow"
          >
            <Menu className="h-4 w-4" />
          </Button>
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">Indexes</h2>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search indexes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card border-border"
            />
          </div>
        )}
      </div>

      {/* Index List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredIndexes.map((index) => {
          const Icon = getCategoryIcon(index.category);
          return (
            <Card
              key={index.id}
              className={cn(
                "p-3 cursor-pointer hover-3d transition-smooth glass-card",
                selectedIndex?.id === index.id 
                  ? "border-primary glow" 
                  : "hover:border-primary/50",
                isCollapsed && "p-2 aspect-square flex items-center justify-center"
              )}
              onClick={() => onIndexSelect(index)}
            >
              {isCollapsed ? (
                <div className="flex flex-col items-center space-y-1">
                  <Icon className="h-5 w-5 text-primary animate-float" />
                  {index.hasGeoData && (
                    <MapPin className="h-2 w-2 text-data-green" />
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-primary animate-float" />
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {index.name}
                      </h3>
                    </div>
                    {index.hasGeoData && (
                      <MapPin className="h-3 w-3 text-data-green animate-glow" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{index.docCount.toLocaleString()} docs</span>
                      <span>{index.size}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs glass-card">
                        {index.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {index.lastUpdated}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}