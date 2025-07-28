import { useState, useEffect } from "react";
import { Database, TrendingUp, Globe } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { FilterableDataTable } from "@/components/FilterableDataTable";
import { MapVisualization } from "@/components/MapVisualization";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dashboardHero from "@/assets/dashboard-hero.jpg";

interface IndexData {
  uuid: string;
  index: string;
  'docs.count': string;
  'store.size': string;
  health: string;
  status: string;
}

const Index = () => {
  const [selectedIndex, setSelectedIndex] = useState<IndexData | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedIndex) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${selectedIndex.index}/_search`);
        const result = await response.json();
        setData(result.hits.hits.map((hit: any) => ({ id: hit._id, ...hit._source })));
      } catch (error) {
        console.error(`Error fetching data for index ${selectedIndex.index}:`, error);
      }
    };

    fetchData();
  }, [selectedIndex]);

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
                      {selectedIndex.index}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {parseInt(selectedIndex["docs.count"]).toLocaleString()} documents • {selectedIndex["store.size"]} • {selectedIndex.health}
                    </p>
                  </div>
                  <Badge variant="secondary" className="glass-card hover-3d">
                    {selectedIndex.status}
                  </Badge>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Data Table */}
                  <Card className="glass-card hover-3d overflow-hidden">
                    <div className="p-6 h-full overflow-y-auto">
                      <FilterableDataTable 
                        indexName={selectedIndex.index}
                        onRowSelect={setSelectedRecord}
                        selectedRow={selectedRecord?.id}
                        data={data}
                        onFilteredDataChange={setFilteredData}
                      />
                    </div>
                  </Card>

                  {/* Map Visualization */}
                  <Card className="glass-card hover-3d overflow-hidden">
                    <div className="p-6 h-full overflow-y-auto">
                      <MapVisualization 
                        data={filteredData}
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