"use client"

import { useDataInfo } from "@/lib/DataContext";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { parseCSV } from "@/lib/data-parser";
import { Button } from "@/components/ui/button";
import { BarChart3, Database } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { InsightsDashboard } from "@/components/dashboard/InsightsDashboard";
import { AskAI } from "@/components/dashboard/AskAI";
import { DataTable } from "@/components/dashboard/DataTable";

const DEMO_DATASETS = [
    { name: "Global Energy Consumption", file: "global-energy-consumption.csv" },
    { name: "City Air Quality", file: "city-air-quality.csv" },
    { name: "E-Commerce Sales", file: "ecommerce-sales.csv" },
];

export default function DashboardPage() {
    const { parsedData, setParsedData, datasetName, setDatasetName, isLoading, setIsLoading } = useDataInfo();
    const [error, setError] = useState<string | null>(null);

    const loadDemoDataset = async (filename: string, name: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const url = `/demo-datasets/${filename}`;
            const result = await parseCSV(url);
            setParsedData(result);
            setDatasetName(name);
        } catch (err: any) {
            setError("Failed to load demo dataset. " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // If no data uploaded, show upload section
    if (!parsedData) {
        return (
            <div className="min-h-screen flex flex-col pt-20 px-4 md:px-8 max-w-6xl mx-auto">
                <header className="fixed top-0 left-0 right-0 z-10 flex h-14 items-center px-6 border-b border-border/40 bg-background/50 backdrop-blur-xl">
                    <Link href="/" className="flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold tracking-tight">DataLens</span>
                    </Link>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                >
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                        Upload your dataset
                    </h1>
                    <p className="text-base text-muted-foreground mb-8 max-w-2xl">
                        Drag and drop a CSV file to instantly generate AI-powered visualizations and insights.
                    </p>

                    <FileDropzone />

                    <div className="mt-16 w-full max-w-4xl flex flex-col items-center">
                        <div className="flex items-center gap-4 w-full mb-8">
                            <div className="h-px bg-border flex-1" />
                            <span className="text-muted-foreground text-sm font-medium">OR TRY A DEMO DATASET</span>
                            <div className="h-px bg-border flex-1" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {DEMO_DATASETS.map((demo) => (
                                <button
                                    key={demo.name}
                                    onClick={() => loadDemoDataset(demo.file, demo.name)}
                                    disabled={isLoading}
                                    className="flex flex-col items-start gap-4 p-6 glass-hover rounded-2xl text-left group disabled:opacity-50 disabled:cursor-not-allowed w-full"
                                >
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-all shadow-inner">
                                        <Database className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-foreground">{demo.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Load sample dataset to explore features instantly</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        {error && <p className="text-destructive mt-6">{error}</p>}
                    </div>
                </motion.div>
            </div>
        );
    }

    // If data uploaded, show dashboard (To be implemented next)
    return (
        <div className="min-h-screen flex flex-col pt-14 relative">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
                <div className="absolute top-[-20%] right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px]" />
            </div>

            <header className="fixed top-0 left-0 right-0 z-10 flex h-14 items-center px-6 border-b border-white/5 bg-background/60 backdrop-blur-xl">
                <Link href="/" className="flex items-center gap-2 group">
                    <BarChart3 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-bold tracking-tight">DataLens</span>
                </Link>
                <div className="ml-8 flex items-center gap-2 text-sm text-primary-foreground/80 bg-primary/20 border border-primary/20 px-4 py-1.5 rounded-full shadow-inner">
                    <Database className="h-4 w-4" />
                    {parsedData.summary.rowCount} rows • {parsedData.summary.colCount} columns
                </div>
                <div className="ml-auto">
                    <Button variant="outline" size="sm" onClick={() => setParsedData(null)} className="glass-hover border-white/10">
                        Upload New File
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6 pt-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {datasetName ? datasetName.replace(/\.csv$/i, '') : "Data Overview"}
                    </h1>
                    <p className="text-muted-foreground">
                        AI-generated visualizations and insights based on your dataset.
                    </p>
                </div>

                <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
                    {/* Left Column: Visualizations Grid (Occupies most space) */}
                    <div className="w-full xl:w-2/3 flex flex-col gap-6">
                        <InsightsDashboard />
                    </div>

                    {/* Right Column: AI Chat & Context */}
                    <div className="w-full xl:w-1/3 flex flex-col gap-6 xl:sticky xl:top-20">
                        <AskAI />
                    </div>
                </div>

                <div className="mt-4">
                    <DataTable />
                </div>
            </main>
        </div>
    );
}
