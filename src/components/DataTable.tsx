import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, MapPin, Calendar, Database } from "lucide-react";
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
  data: DataRecord[];
}

export function DataTable({ indexName, onRowSelect, selectedRow, data }: DataTableProps) {
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterTerm, setFilterTerm] = useState("");

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