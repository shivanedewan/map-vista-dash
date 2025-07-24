import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, MapPin, Calendar, User, Package, Database } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataRecord {
  id: string;
  [key: string]: any;
}

interface DataTableProps {
  indexName: string;
  onRowSelect?: (record: DataRecord) => void;
  selectedRow?: string;
}

// Sample data for different indexes
const sampleData: Record<string, DataRecord[]> = {
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

export function DataTable({ indexName, onRowSelect, selectedRow }: DataTableProps) {
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterTerm, setFilterTerm] = useState("");

  const data = sampleData[indexName] || [];

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(record =>
      Object.values(record).some(value =>
        String(value).toLowerCase().includes(filterTerm.toLowerCase())
      )
    );

    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (sortDirection === "asc") {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [data, filterTerm, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderCellValue = (key: string, value: any) => {
    if (key === "latitude" || key === "longitude") {
      return (
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3 text-data-green" />
          <span className="font-mono text-sm">{Number(value).toFixed(4)}</span>
        </div>
      );
    }
    
    if (key.includes("Date") || key.includes("lastSeen") || key.includes("estimatedDelivery")) {
      return (
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-data-blue" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      );
    }
    
    if (key === "status") {
      const statusColors = {
        active: "bg-data-green/20 text-data-green",
        offline: "bg-muted text-muted-foreground",
        in_transit: "bg-data-orange/20 text-data-orange",
        delivered: "bg-data-green/20 text-data-green"
      };
      
      return (
        <Badge className={statusColors[value as keyof typeof statusColors] || "bg-muted"}>
          {value}
        </Badge>
      );
    }
    
    if (typeof value === "number" && key === "revenue") {
      return <span className="font-mono">${value.toLocaleString()}</span>;
    }
    
    return <span className="text-sm">{String(value)}</span>;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No data available for this index</p>
        </div>
      </div>
    );
  }

  const columns = Object.keys(data[0]).filter(key => key !== "id");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Data Explorer</h3>
        <Input
          placeholder="Filter data..."
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column)}
                    className="flex items-center space-x-1 p-0 h-auto font-medium"
                  >
                    <span>{column}</span>
                    {sortField === column && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="h-3 w-3" /> : 
                        <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((record) => (
              <TableRow
                key={record.id}
                className={cn(
                  "cursor-pointer hover:bg-muted/50",
                  selectedRow === record.id && "bg-primary/10"
                )}
                onClick={() => onRowSelect?.(record)}
              >
                {columns.map((column) => (
                  <TableCell key={column}>
                    {renderCellValue(column, record[column])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedData.length} of {data.length} records
      </div>
    </div>
  );
}