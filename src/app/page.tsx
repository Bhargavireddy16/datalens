"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Upload, Zap, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute -bottom-[30%] left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-500/10 blur-[150px]" />
      </div>

      <header className="z-10 flex h-14 items-center px-6 lg:px-12 border-b border-border/40 bg-background/50 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">DataLens</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary text-muted-foreground transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary text-muted-foreground transition-colors" href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </header>

      <main className="flex-1 z-10">
        <section className="w-full py-12 px-4 md:py-20">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-border/50 bg-background/50 backdrop-blur-xl px-3 py-1 text-xs mb-6"
            >
              <Sparkles className="h-4 w-4 mr-2 text-blue-400" />
              <span className="text-muted-foreground">AI-Powered Data Intelligence Studio</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50 pb-4"
            >
              See the unseen in your {" "}
              <span className="relative">
                <span className="absolute -inset-1 rounded-lg bg-primary/20 blur-lg"></span>
                <span className="relative text-primary">data</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-[700px] text-muted-foreground md:text-lg font-light mb-8"
            >
              Upload your CSV and let our AI generate rich, interactive visualizations and actionable insights instantly. No coding required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-6 text-sm shadow-xl shadow-primary/20 rounded-full group">
                  Explore Your Data
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-12 px-6 text-sm rounded-full bg-background/50 backdrop-blur-xl">
                  See how it works
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="features" className="w-full py-16 bg-background border-t border-border/40 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-start gap-4 p-8 rounded-3xl border border-border/50 bg-card/50 hover:bg-card/80 backdrop-blur-xl transition-colors"
              >
                <div className="bg-primary/10 p-4 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Instant Upload</h3>
                <p className="text-muted-foreground text-lg">
                  Drag and drop your CSV files. We automatically parse your data, detect types, and understand your schema in milliseconds.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-start gap-4 p-8 rounded-3xl border border-border/50 bg-card/50 hover:bg-card/80 backdrop-blur-xl transition-colors"
              >
                <div className="bg-blue-500/10 p-4 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold">Auto Visualizations</h3>
                <p className="text-muted-foreground text-lg">
                  Our LLM understands what your data is about and curates the perfect suite of interactive charts and graphs to represent it.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-start gap-4 p-8 rounded-3xl border border-border/50 bg-card/50 hover:bg-card/80 backdrop-blur-xl transition-colors"
              >
                <div className="bg-indigo-500/10 p-4 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                  <Zap className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-semibold">Ask Your Data</h3>
                <p className="text-muted-foreground text-lg">
                  Have a specific question? Ask in plain English and our AI will deliver accurate answers instantly based on the datasets.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="z-10 flex flex-col sm:flex-row py-8 w-full shrink-0 items-center px-6 border-t border-border/40 bg-background/80 backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">© 2026 DataLens Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-6 mt-4 sm:mt-0">
          <Link className="text-sm hover:text-foreground text-muted-foreground transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm hover:text-foreground text-muted-foreground transition-colors" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
