"use client"

import React, { useCallback, useState } from "react";
import { UploadCloud, FileType, AlertCircle, Loader2 } from "lucide-react";
import { useDataInfo } from "@/lib/DataContext";
import { parseCSV } from "@/lib/data-parser";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function FileDropzone() {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setParsedData, setDatasetName, isLoading, setIsLoading } = useDataInfo();
    const router = useRouter();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFile = async (file: File) => {
        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            setError("Please upload a valid CSV file.");
            return;
        }

        try {
            setError(null);
            setIsLoading(true);
            const result = await parseCSV(file);
            setParsedData(result);
            setDatasetName(file.name);
            // Wait a tick for state to settle then optionally navigate or show preview
        } catch (err: any) {
            setError(err.message || "Failed to parse CSV file.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) {
                processFile(file);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                processFile(file);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <div className="w-full max-w-4xl mx-auto mt-8">
            <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 relative overflow-hidden group",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border/60 bg-card/30 hover:bg-card/80 hover:border-primary/50"
                )}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 relative z-10 w-full h-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4 text-primary">
                            <Loader2 className="h-12 w-12 animate-spin" />
                            <p className="text-lg font-medium">Analyzing your data...</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                <UploadCloud className="w-10 h-10 text-primary" />
                            </div>
                            <p className="mb-2 text-xl font-semibold tracking-tight text-foreground">
                                <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-sm text-muted-foreground">CSV files only (max. 100MB)</p>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileInput}
                    disabled={isLoading}
                />

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </label>

            {error && (
                <div className="mt-4 flex items-center p-4 text-sm text-destructive border border-destructive/20 rounded-xl bg-destructive/10">
                    <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
                    <span className="sr-only">Error</span>
                    <div>{error}</div>
                </div>
            )}
        </div>
    );
}
