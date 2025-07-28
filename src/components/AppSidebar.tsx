import { useState, useEffect } from "react";
import { Search, Database, MapPin, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IndexData {
  uuid: string;
  index: string;
  'docs.count': string;
  'store.size': string;
  health: string;
  status: string;
}

interface AppSidebarProps {
  onIndexSelect: (index: IndexData) => void;
  selectedIndex: IndexData | null;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ onIndexSelect, selectedIndex, isCollapsed, onToggle }: AppSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [indexes, setIndexes] = useState<IndexData[]>([]);

  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        const response = await fetch("/api/_cat/indices?format=json");
        const data = await response.json();
        setIndexes(data);
      } catch (error) {
        console.error("Error fetching indexes:", error);
      }
    };

    fetchIndexes();
  }, []);

  const filteredIndexes = indexes.filter(index =>
    index.index.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          const Icon = Database;
          return (
            <Card
              key={index.uuid}
              className={cn(
                "p-3 cursor-pointer hover-3d transition-smooth glass-card",
                selectedIndex?.uuid === index.uuid
                  ? "border-primary glow" 
                  : "hover:border-primary/50",
                isCollapsed && "p-2 aspect-square flex items-center justify-center"
              )}
              onClick={() => onIndexSelect(index)}
            >
              {isCollapsed ? (
                <div className="flex flex-col items-center space-y-1">
                  <Icon className="h-5 w-5 text-primary animate-float" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-primary animate-float" />
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {index.index}
                      </h3>
                    </div>
                    <MapPin className="h-3 w-3 text-data-green animate-glow" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{parseInt(index['docs.count']).toLocaleString()} docs</span>
                      <span>{index['store.size']}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs glass-card">
                        {index.health}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {index.status}
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