import { useState, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataRecord {
  id: string;
  [key: string]: any;
}

interface FilterableDataTableProps {
  indexName: string;
  data: DataRecord[];
  onRowSelect?: (record: DataRecord) => void;
  selectedRow?: string;
  onFilteredDataChange: (data: DataRecord[]) => void;
}

export function FilterableDataTable({ indexName, data, onRowSelect, selectedRow, onFilteredDataChange }: FilterableDataTableProps) {
  const [filters, setFilters] = useState<{ field: string; value: string }[]>([]);
  const [newFilterField, setNewFilterField] = useState<string>("");
  const [newFilterValue, setNewFilterValue] = useState<string>("");

  const fields = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = data;
    filters.forEach(filter => {
      filtered = filtered.filter(record =>
        String(record[filter.field]).toLowerCase().includes(filter.value.toLowerCase())
      );
    });
    onFilteredDataChange(filtered);
    return filtered;
  }, [data, filters, onFilteredDataChange]);

  const addFilter = () => {
    if (newFilterField && newFilterValue) {
      setFilters([...filters, { field: newFilterField, value: newFilterValue }]);
      setNewFilterField("");
      setNewFilterValue("");
    }
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Select onValueChange={setNewFilterField} value={newFilterField}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map(field => (
              <SelectItem key={field} value={field}>{field}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter value..."
          value={newFilterValue}
          onChange={(e) => setNewFilterValue(e.target.value)}
          className="w-64"
        />
        <Button onClick={addFilter}>Add Filter</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
            <span>{filter.field}: {filter.value}</span>
            <Button variant="ghost" size="sm" onClick={() => removeFilter(index)}>x</Button>
          </div>
        ))}
      </div>
      <DataTable
        indexName={indexName}
        data={filteredData}
        onRowSelect={onRowSelect}
        selectedRow={selectedRow}
      />
    </div>
  );
}