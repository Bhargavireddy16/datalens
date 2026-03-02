"use client"

import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDataInfo } from "@/lib/DataContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function AskAI() {
    const { parsedData } = useDataInfo();
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || !parsedData) return;

        setIsLoading(true);
        setAnswer(null);
        setError(null);

        try {
            const response = await fetch("/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question,
                    columns: parsedData.summary.columns,
                    preview: parsedData.summary.preview,
                    summaryStats: {
                        rowCount: parsedData.summary.rowCount,
                        colCount: parsedData.summary.colCount,
                    }
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get answer");
            }

            const data = await response.json();
            setAnswer(data.answer);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full glass p-1 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
            <div className="p-4 md:p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                    <div className="bg-primary/20 p-2 rounded-xl">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Ask Your Data</h2>
                        <p className="text-sm text-muted-foreground">Get instant insights in plain English.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative group">
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="E.g. Which region had the highest total revenue in 2023?"
                            className="w-full bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border focus:border-primary/50 text-foreground rounded-2xl pl-6 pr-16 py-3 outline-none transition-all focus:ring-4 focus:ring-primary/10"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!question.trim() || isLoading}
                            className="absolute right-2 top-2 bottom-2 rounded-xl"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                </form>

                <AnimatePresence>
                    {(answer || error || isLoading) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-secondary/30 rounded-2xl border border-border/40">
                                {isLoading ? (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <div className="p-2 bg-primary/20 rounded-lg">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        </div>
                                        <span className="text-sm animate-pulse">Analyzing the dataset and generating insights...</span>
                                    </div>
                                ) : error ? (
                                    <div className="flex items-start gap-4 text-destructive">
                                        <Bot className="h-5 w-5 shrink-0 mt-0.5" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                ) : answer ? (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/20 rounded-lg shrink-0 mt-1">
                                            <Bot className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="text-sm md:text-base leading-relaxed text-foreground opacity-90 w-full prose prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {answer}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Suggestions */}
                {!answer && !isLoading && !error && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {['What are the key trends?', 'Show me a summary', 'Are there any outliers?'].map(q => (
                            <button
                                key={q}
                                type="button"
                                onClick={() => setQuestion(q)}
                                className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-background hover:bg-secondary hover:border-border text-muted-foreground transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
