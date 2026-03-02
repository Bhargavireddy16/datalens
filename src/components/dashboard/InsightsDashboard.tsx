"use client"

import React, { useEffect, useState } from "react";
import { useDataInfo } from "@/lib/DataContext";
import { AutoChart, ChartConfig } from "@/components/charts/AutoChart";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";

export function InsightsDashboard() {
    const { parsedData } = useDataInfo();
    const [configs, setConfigs] = useState<ChartConfig[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInsights() {
            if (!parsedData) return;
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        columns: parsedData.summary.columns,
                        preview: parsedData.summary.preview,
                    }),
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.error || "Failed to analyze data");
                }

                const data = await response.json();
                setConfigs(data.charts || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchInsights();
    }, [parsedData]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-96 flex flex-col p-6 bg-card/50 border-border/40">
                        <div className="h-6 w-2/3 bg-muted rounded mb-4" />
                        <div className="flex-1 bg-muted/50 rounded-xl" />
                        <div className="h-4 w-full bg-muted mt-4 rounded" />
                        <div className="h-4 w-4/5 bg-muted mt-2 rounded" />
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 border border-destructive/20 bg-destructive/10 rounded-3xl text-destructive text-center flex flex-col items-center">
                <Sparkles className="h-10 w-10 mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">AI Analysis Failed</h3>
                <p>{error}</p>
                <p className="text-sm mt-4 opacity-80 max-w-lg">Make sure you have configured a valid OPENAI_API_KEY in the `.env.local` file.</p>
            </div>
        );
    }

    if (configs.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {configs.map((config, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                    <Card className="h-[420px] flex flex-col p-5 glass-hover group relative overflow-hidden">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-secondary/80 backdrop-blur-md rounded-lg hover:bg-primary/20 hover:text-primary transition-colors">
                                <Maximize2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mb-4 pr-8">
                            <h3 className="text-base font-bold tracking-tight leading-tight text-foreground">{config.title}</h3>
                        </div>

                        <div className="flex-1 w-full min-h-0 relative -ml-4">
                            <AutoChart data={parsedData?.data || []} config={config} />
                        </div>

                        <div className="mt-3 pt-3 border-t border-border/50">
                            <div className="flex gap-3 items-start">
                                <Sparkles className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-muted-foreground leading-relaxed">{config.insight}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
