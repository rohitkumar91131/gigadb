import { useMemo, useState } from "react"; // Added useState for local input handling
import { MoreHorizontal, FilePlus2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Import Input
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
  flexRender,
} from "@tanstack/react-table";

export default function ModelContent() {
  const { activeModel, tableData, models, setActiveModel } = useDashboard();

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
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: { pageSize: 10 },
    },
  });

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
          <h1 className="text-2xl font-semibold tracking-tight hidden md:block">{activeModel}</h1>
          <h1 className="text-xl font-semibold tracking-tight md:hidden">Records</h1>
          <p className="text-sm text-muted-foreground">
             Total {tableData.length} records found
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FilePlus2 className="mr-2 h-4 w-4" /> 
          <span className="hidden sm:inline">Add Record</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Table Container */}
      <div className="flex-1 rounded-md border bg-background shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/40 sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* --- UPDATED PAGINATION FOOTER --- */}
        <div className="flex items-center justify-between px-4 py-4 border-t bg-white">
            
            {/* Left Side: Page Info & Jump to Page */}
            <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>
                
                {/* Jump to Page Input */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Go to:</span>
                  <Input
                    type="number"
                    min="1"
                    max={table.getPageCount()}
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0;
                      table.setPageIndex(page);
                    }}
                    className="h-8 w-16"
                  />
                </div>
            </div>

            {/* Right Side: Navigation Buttons */}
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
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