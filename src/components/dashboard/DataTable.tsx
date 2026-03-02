"use client"

import React, { useState } from "react";
import { useDataInfo } from "@/lib/DataContext";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROWS_PER_PAGE = 25;

export function DataTable() {
    const { parsedData } = useDataInfo();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    if (!parsedData) return null;

    const { data, summary } = parsedData;

    // Simple search filter: if any column in the row matches the search term
    const filteredData = React.useMemo(() => {
        if (!searchTerm.trim()) return data;
        const lowerSearch = searchTerm.toLowerCase();

        return data.filter((row) => {
            return Object.values(row).some((val) =>
                String(val).toLowerCase().includes(lowerSearch)
            );
        });
    }, [data, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const currentData = filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);

    return (
        <Card className="w-full flex flex-col glass overflow-hidden mt-4">
            <div className="p-3 border-b border-border/40 flex items-center justify-between gap-4 bg-white/5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Raw Data Inspector</h2>

                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Search across all columns..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset page on search
                        }}
                        className="w-full bg-background border border-border/60 hover:border-border text-sm rounded-full pl-9 pr-4 py-2 outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto max-h-[600px] relative">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                            <th className="px-4 py-3 font-semibold w-16 text-center border-b border-border/40">#</th>
                            {summary.columns.map((col) => (
                                <th key={col.name} className="px-4 py-3 font-semibold whitespace-nowrap border-b border-border/40">
                                    <div className="flex items-center gap-2">
                                        {col.name}
                                        <span className="text-[10px] text-muted-foreground/60 tracking-wider lowercase px-1.5 py-0.5 rounded-md bg-background/50 border border-border/20">
                                            {col.type}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="bg-background hover:bg-secondary/30 transition-colors border-b border-border/20 last:border-0 group"
                                >
                                    <td className="px-4 py-2 font-medium text-muted-foreground text-center tabular-nums">
                                        {startIndex + rowIndex + 1}
                                    </td>
                                    {summary.columns.map((col) => {
                                        const val = row[col.name];
                                        return (
                                            <td key={col.name} className="px-4 py-2 truncate max-w-[200px]" title={String(val)}>
                                                {val === null || val === undefined ? (
                                                    <span className="text-muted-foreground opacity-50 italic">null</span>
                                                ) : (
                                                    String(val)
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={summary.columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                                    No matching records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-3 border-t border-border/40 flex items-center justify-between bg-background">
                <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{Math.min(filteredData.length, startIndex + 1)}</span> to <span className="font-medium text-foreground">{Math.min(filteredData.length, startIndex + ROWS_PER_PAGE)}</span> of <span className="font-medium text-foreground">{filteredData.length}</span> entries
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-8 rounded-lg"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <div className="text-sm font-medium px-4">
                        {currentPage} / {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 rounded-lg"
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
