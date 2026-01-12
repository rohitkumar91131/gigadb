import { useMemo } from "react";
import { MoreHorizontal, FilePlus2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/context/DashboardContext";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

export default function ModelContent() {
  const { activeModel, pageData, models, setActiveModel, fetchDbPage } = useDashboard();

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "col1", header: "Name/Item" },
      { accessorKey: "col2", header: "Detail" },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <Badge variant="outline" className="text-xs">
            {info.getValue()}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: pageData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const prettyData = useMemo(() => {
    return pageData.map((row) => {
      try {
        return typeof row === "string" ? JSON.parse(row) : row;
      } catch {
        return row;
      }
    });
  }, [pageData]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20 h-full overflow-hidden">
      {/* Mobile Selector */}
      <div className="md:hidden">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Current Collection
        </label>
        <Select value={activeModel} onValueChange={setActiveModel}>
          <SelectTrigger className="w-full bg-background border-zinc-200">
            <SelectValue placeholder="Select Collection" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight hidden md:block">
            {activeModel}
          </h1>
          <h1 className="text-xl font-semibold tracking-tight md:hidden">
            Records
          </h1>
          <p className="text-sm text-muted-foreground">
            Total {pageData.length} records found
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FilePlus2 className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Record</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Mongo-style JSON Viewer */}
      <div className="flex-1 rounded-md border bg-background shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto bg-zinc-950 p-4">
          <pre className="text-zinc-100 text-sm whitespace-pre-wrap font-mono">
            {JSON.stringify(prettyData, null, 2)}
          </pre>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-4 border-t bg-white">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Page {table.getState().pagination.pageIndex + 1}
            </span>

            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Go to:</span>
              <Input
                type="number"
                min="1"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                  fetchDbPage(page + 1, 10);
                }}
                className="h-8 w-16"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const page = table.getState().pagination.pageIndex;
                if (page > 0) {
                  table.setPageIndex(page - 1);
                  fetchDbPage(page, 10);
                }
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const page = table.getState().pagination.pageIndex + 2;
                table.setPageIndex(page - 1);
                fetchDbPage(page, 10);
              }}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
