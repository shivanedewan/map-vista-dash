import { useState } from "react";
import { Database, TrendingUp, Globe } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { DataTable } from "@/components/DataTable";
import { MapVisualization } from "@/components/MapVisualization";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dashboardHero from "@/assets/dashboard-hero.jpg";

interface IndexData {
  id: string;
  name: string;
  docCount: number;
  size: string;
  hasGeoData: boolean;
  lastUpdated: string;
  category: string;
}

// Sample data for different indexes (same as in DataTable component)
const sampleData: Record<string, any[]> = {
  "user-locations": [
    {
      id: "user_001",
      userId: "USR001",
      name: "John Doe",
      latitude: 40.7128,
      longitude: -74.0060,
      city: "New York",
      country: "USA",
      lastSeen: "2024-01-20T10:30:00Z",
      status: "active"
    },
    {
      id: "user_002", 
      userId: "USR002",
      name: "Jane Smith",
      latitude: 51.5074,
      longitude: -0.1278,
      city: "London",
      country: "UK",
      lastSeen: "2024-01-20T09:15:00Z",
      status: "active"
    },
    {
      id: "user_003",
      userId: "USR003", 
      name: "Carlos Rodriguez",
      latitude: 48.8566,
      longitude: 2.3522,
      city: "Paris",
      country: "France",
      lastSeen: "2024-01-19T18:45:00Z",
      status: "offline"
    }
  ],
  "delivery-tracking": [
    {
      id: "del_001",
      trackingId: "TRK12345",
      latitude: 37.7749,
      longitude: -122.4194,
      address: "123 Market St, San Francisco, CA",
      status: "in_transit",
      estimatedDelivery: "2024-01-21T14:00:00Z",
      packageType: "Electronics"
    },
    {
      id: "del_002",
      trackingId: "TRK12346", 
      latitude: 34.0522,
      longitude: -118.2437,
      address: "456 Sunset Blvd, Los Angeles, CA",
      status: "delivered",
      estimatedDelivery: "2024-01-20T16:30:00Z",
      packageType: "Clothing"
    }
  ],
  "store-analytics": [
    {
      id: "store_001",
      storeId: "ST001",
      storeName: "Downtown Electronics",
      latitude: 40.7589,
      longitude: -73.9851,
      revenue: 15420.50,
      customers: 89,
      date: "2024-01-20",
      category: "Electronics"
    },
    {
      id: "store_002",
      storeId: "ST002", 
      storeName: "Fashion Central",
      latitude: 40.7505,
      longitude: -73.9934,
      revenue: 23180.75,
      customers: 156,
      date: "2024-01-20",
      category: "Fashion"
    }
  ]
};

const Index = () => {
  const [selectedIndex, setSelectedIndex] = useState<IndexData | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentData = selectedIndex ? sampleData[selectedIndex.id] || [] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-border px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Database className="h-8 w-8 text-primary animate-glow" />
              <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-data-green bg-clip-text text-transparent">
                MapVista Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Data Analytics & Geographic Visualization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1 glass-card hover-3d">
              <TrendingUp className="h-3 w-3 animate-float" />
              <span>Live Data</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1 glass-card hover-3d">
              <Globe className="h-3 w-3 animate-float" />
              <span>4 Indexes</span>
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <AppSidebar 
          onIndexSelect={setSelectedIndex} 
          selectedIndex={selectedIndex}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {selectedIndex ? (
            <div className="h-full flex flex-col">
              {/* Index Header */}
              <div className="glass-card border-b border-border p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground bg-gradient-to-r from-primary to-data-purple bg-clip-text text-transparent">
                      {selectedIndex.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedIndex.docCount.toLocaleString()} documents • {selectedIndex.size} • Last updated {selectedIndex.lastUpdated}
                    </p>
                  </div>
                  <Badge variant="secondary" className="glass-card hover-3d">
                    {selectedIndex.category}
                  </Badge>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Data Table */}
                  <Card className="glass-card hover-3d overflow-hidden">
                    <div className="p-6 h-full overflow-y-auto">
                      <DataTable 
                        indexName={selectedIndex.id}
                        onRowSelect={setSelectedRecord}
                        selectedRow={selectedRecord?.id}
                      />
                    </div>
                  </Card>

                  {/* Map Visualization */}
                  <Card className="glass-card hover-3d overflow-hidden">
                    <div className="p-6 h-full overflow-y-auto">
                      <MapVisualization 
                        indexName={selectedIndex.id}
                        data={currentData}
                        selectedRecord={selectedRecord}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            /* Welcome Screen */
            <div className="h-full flex items-center justify-center p-6">
              <Card className="max-w-2xl w-full text-center space-y-6 p-8 glass-card hover-3d">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={dashboardHero} 
                    alt="Dashboard Analytics" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary via-data-green to-data-purple bg-clip-text text-transparent">
                    Welcome to MapVista Dashboard
                  </h2>
                  <p className="text-muted-foreground">
                    Select an index from the sidebar to explore your data and visualize geographic information on interactive maps.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2 glass-card p-4 rounded-lg hover-3d">
                    <Database className="h-8 w-8 mx-auto text-primary animate-float" />
                    <p className="text-sm font-medium">Data Explorer</p>
                    <p className="text-xs text-muted-foreground">Browse and filter index data</p>
                  </div>
                  <div className="space-y-2 glass-card p-4 rounded-lg hover-3d">
                    <Globe className="h-8 w-8 mx-auto text-data-green animate-float" />
                    <p className="text-sm font-medium">Map Visualization</p>
                    <p className="text-xs text-muted-foreground">Plot coordinates on interactive maps</p>
                  </div>
                  <div className="space-y-2 glass-card p-4 rounded-lg hover-3d">
                    <TrendingUp className="h-8 w-8 mx-auto text-data-orange animate-float" />
                    <p className="text-sm font-medium">Real-time Analytics</p>
                    <p className="text-xs text-muted-foreground">Monitor data patterns and trends</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;