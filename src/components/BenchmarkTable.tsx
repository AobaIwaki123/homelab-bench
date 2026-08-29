"use client";

import { useMemo, useState, type ReactNode } from "react";
import { type BenchmarkModel } from "@/lib/benchmarks";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type SortableKey = keyof BenchmarkModel;

interface Column {
  accessorKey: SortableKey;
  header: string;
  size: number;
  render?: (model: BenchmarkModel) => ReactNode;
}

const columns: Column[] = [
  { accessorKey: "rank", header: "#", size: 40 },
  {
    accessorKey: "model_name",
    header: "Model",
    size: 180,
    render: (model) => (
      <div>
        <div className="font-medium text-sm">{model.model_name}</div>
        <div className="text-xs text-gray-500">{model.developer}</div>
      </div>
    ),
  },
  { accessorKey: "release_date", header: "Released", size: 90 },
  { accessorKey: "parameters", header: "Params", size: 70 },
  { accessorKey: "size_gb", header: "Size (GB)", size: 80, render: (model) => `${model.size_gb.toFixed(2)} GB` },
  {
    accessorKey: "overall_accuracy",
    header: "Accuracy",
    size: 90,
    render: (model) => {
      const value = model.overall_accuracy;
      return (
        <span className={cn("font-bold", value >= 90 ? "text-green-500" : value >= 70 ? "text-yellow-500" : "text-red-500")}>
          {value.toFixed(1)}%
        </span>
      );
    },
  },
  { accessorKey: "gen_tps", header: "Speed (t/s)", size: 100, render: (model) => `${model.gen_tps.toFixed(1)} t/s` },
  { accessorKey: "avg_latency_ms", header: "Latency", size: 80, render: (model) => `${model.avg_latency_ms.toFixed(0)} ms` },
  { accessorKey: "quantization", header: "Quant", size: 80 },
];

interface Props {
  models: BenchmarkModel[];
}

export default function BenchmarkTable({ models }: Props) {
  const [sorting, setSorting] = useState<{ id: SortableKey; desc: boolean }>({ id: "overall_accuracy", desc: true });
  const [globalFilter, setGlobalFilter] = useState("");

  const filteredModels = useMemo(() => {
    const query = globalFilter.trim().toLowerCase();
    const filtered = query
      ? models.filter((model) => Object.values(model).some((value) => String(value).toLowerCase().includes(query)))
      : models;

    return [...filtered].sort((a, b) => {
      const aValue = a[sorting.id];
      const bValue = b[sorting.id];
      const comparison = typeof aValue === "number" && typeof bValue === "number"
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue));
      return sorting.desc ? -comparison : comparison;
    });
  }, [globalFilter, models, sorting]);

  function toggleSorting(id: SortableKey) {
    setSorting((current) => ({ id, desc: current.id === id ? !current.desc : false }));
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Filter models..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="w-full max-w-sm px-3 py-2 text-sm border border-gray-700 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th key={column.accessorKey} className="px-4 py-3 text-left font-medium text-gray-300 cursor-pointer select-none hover:bg-gray-700 transition-colors" style={{ width: column.size }} onClick={() => toggleSorting(column.accessorKey)}>
                  <div className="flex items-center gap-1">
                    {column.header}
                    <span className="text-gray-500">
                      {sorting.id !== column.accessorKey ? <ChevronsUpDown className="w-3 h-3" /> : sorting.desc ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredModels.map((model, index) => (
              <tr key={`${model.model_name}-${model.quantization}`} className={cn("border-t border-gray-700 hover:bg-gray-800 transition-colors", index === 0 && sorting.id === "overall_accuracy" && "bg-gray-800/50")}>
                {columns.map((column) => (
                  <td key={column.accessorKey} className="px-4 py-3 text-gray-200">
                    {column.render ? column.render(model) : String(model[column.accessorKey])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredModels.length === 0 && <div className="py-10 text-center text-gray-500">No models found.</div>}
      </div>
      <p className="text-xs text-gray-500">{filteredModels.length} / {models.length} models shown</p>
    </div>
  );
}
