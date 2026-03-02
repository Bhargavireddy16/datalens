"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { type ParsedData } from "./data-parser";

interface DataContextType {
    parsedData: ParsedData | null;
    setParsedData: (data: ParsedData | null) => void;
    datasetName: string | null;
    setDatasetName: (name: string | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [parsedData, setParsedData] = useState<ParsedData | null>(null);
    const [datasetName, setDatasetName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <DataContext.Provider
            value={{
                parsedData,
                setParsedData,
                datasetName,
                setDatasetName,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useDataInfo() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useDataInfo must be used within a DataProvider");
    }
    return context;
}
