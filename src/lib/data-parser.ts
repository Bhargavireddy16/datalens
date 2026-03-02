import Papa from "papaparse";

export type DataType = "string" | "number" | "boolean" | "date" | "unknown";

export interface ColumnMetadata {
    name: string;
    type: DataType;
    uniqueValues?: number;
}

export interface DatasetSummary {
    rowCount: number;
    colCount: number;
    columns: ColumnMetadata[];
    preview: any[]; // First few rows
}

export interface ParsedData {
    data: any[];
    summary: DatasetSummary;
}

// Helper to infer basic data types from an array of sample values
function inferDataType(values: any[]): DataType {
    let hasString = false;
    let hasNumber = false;
    let hasBoolean = false;
    let hasDate = false;

    for (const v of values) {
        if (v === null || v === undefined || v === "") continue;

        if (typeof v === "boolean" || v === "true" || v === "false") {
            hasBoolean = true;
        } else if (!isNaN(Number(v))) {
            hasNumber = true;
        } else if (!isNaN(Date.parse(String(v))) && String(v).length > 6) {
            // Basic check for dates
            hasDate = true;
        } else {
            hasString = true;
        }
    }

    if (hasString) return "string";
    if (hasDate && !hasNumber && !hasBoolean) return "date";
    if (hasNumber && !hasBoolean) return "number";
    if (hasBoolean && !hasNumber) return "boolean";
    return "string"; // Default fallback
}

export async function parseCSV(fileOrUrl: File | string): Promise<ParsedData> {
    return new Promise((resolve, reject) => {
        const config: any = {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            download: typeof fileOrUrl === "string", // if it's a URL/path
            complete: (results: any) => {
                if (results.errors.length && !results.data.length) {
                    reject(results.errors);
                    return;
                }

                const data = results.data as any[];
                if (data.length === 0) {
                    reject(new Error("Empty CSV"));
                    return;
                }

                // Generate Metadata
                const columns = Object.keys(data[0] || {});
                // Take a sample of first 50 rows for type inference
                const sampleRows = data.slice(0, 50);

                const colMeta: ColumnMetadata[] = columns.map((col) => {
                    const values = sampleRows.map((row) => row[col]);
                    return {
                        name: col,
                        type: inferDataType(values),
                    };
                });

                const summary: DatasetSummary = {
                    rowCount: data.length,
                    colCount: columns.length,
                    columns: colMeta,
                    preview: data.slice(0, 15),
                };

                resolve({ data, summary });
            },
            error: (error: any) => {
                reject(error);
            },
        };

        if (typeof fileOrUrl === "string") {
            Papa.parse(fileOrUrl, config);
        } else {
            Papa.parse(fileOrUrl, config);
        }
    });
}
