import React, { useMemo } from "react";
import {
    BarChart, Bar,
    LineChart, Line,
    ScatterChart, Scatter,
    PieChart, Pie, Cell,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ['#818cf8', '#f472b6', '#2dd4bf', '#fbbf24', '#c084fc', '#34d399', '#38bdf8', '#a78bfa'];

const GRADIENTS = [
    { id: 'color0', from: '#818cf8', to: '#c084fc' }, // Indigo to Purple
    { id: 'color1', from: '#f472b6', to: '#fb7185' }, // Pink to Rose
    { id: 'color2', from: '#2dd4bf', to: '#3b82f6' }, // Teal to Blue
    { id: 'color3', from: '#fbbf24', to: '#ef4444' }, // Amber to Red
    { id: 'color4', from: '#a78bfa', to: '#e879f9' }, // Violet to Fuchsia
    { id: 'color5', from: '#34d399', to: '#06b6d4' }, // Emerald to Cyan
];

const truncateLabel = (val: any) => {
    if (typeof val === 'string' && val.length > 12) {
        return val.substring(0, 12) + '...';
    }
    return val;
};

const formatYAxis = (val: any) => {
    if (typeof val === 'number') {
        if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
        if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
        return val.toLocaleString();
    }
    return val;
};

export interface ChartConfig {
    chart_type: "bar" | "line" | "scatter" | "pie" | "donut" | "area" | "composed";
    title: string;
    x_column: string;
    y_column: string;
    group_by?: string | null;
    aggregation: "sum" | "average" | "count" | "min" | "max" | "none";
    insight: string;
}

interface AutoChartProps {
    data: any[];
    config: ChartConfig;
}

// Simple reducer to compute aggregations
function aggregateData(data: any[], config: ChartConfig) {
    if (config.aggregation === "none") {
        return data;
    }

    const { x_column, y_column, aggregation } = config;
    const groups: Record<string, { sum: number; count: number; min: number; max: number }> = {};

    data.forEach(row => {
        const xKey = row[x_column];
        const yVal = Number(row[y_column]) || 0;

        if (xKey === undefined) return;

        const xStr = String(xKey);
        if (!groups[xStr]) {
            groups[xStr] = { sum: 0, count: 0, min: yVal, max: yVal };
        }

        groups[xStr].sum += yVal;
        groups[xStr].count += 1;
        groups[xStr].min = Math.min(groups[xStr].min, yVal);
        groups[xStr].max = Math.max(groups[xStr].max, yVal);
    });

    return Object.keys(groups).map((key) => {
        const g = groups[key];
        let aggVal = 0;
        switch (aggregation) {
            case "sum": aggVal = g.sum; break;
            case "average": aggVal = g.sum / g.count; break;
            case "count": aggVal = g.count; break;
            case "min": aggVal = g.min; break;
            case "max": aggVal = g.max; break;
        }

        return {
            [x_column]: key,
            [y_column]: Number(aggVal.toFixed(2)) // Keep it neat
        };
    });
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="glass p-4 rounded-xl shadow-2xl shadow-black/50">
                <p className="font-semibold text-foreground mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span className="font-medium text-foreground">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
}

export function AutoChart({ data, config }: AutoChartProps) {
    // Aggregate data client-side before plotting
    const processedData = useMemo(() => aggregateData(data, config), [data, config]);

    if (!processedData || processedData.length === 0) {
        return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data available for this chart</div>
    }

    // Fallback map since we don't have separate charts for everything in MVP (e.g radar/heatmap complex)
    const chartType = config.chart_type.toLowerCase();

    const renderDefs = () => (
        <defs>
            {GRADIENTS.map((g) => (
                <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={g.from} stopOpacity={1} />
                    <stop offset="95%" stopColor={g.to} stopOpacity={0.2} />
                </linearGradient>
            ))}
        </defs>
    );

    const renderChart = () => {
        switch (chartType) {
            case "line":
                return (
                    <LineChart data={processedData} margin={{ top: 20, right: 20, left: 10, bottom: 60 }}>
                        {renderDefs()}
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey={config.x_column} tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} angle={-45} textAnchor="end" tickFormatter={truncateLabel} dx={-5} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={formatYAxis} width={50} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey={config.y_column} stroke={COLORS[0]} strokeWidth={3} dot={{ r: 4, fill: COLORS[0], strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </LineChart>
                );
            case "pie":
            case "donut":
                const isDonut = chartType === "donut";
                return (
                    <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
                        {renderDefs()}
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: '12px' }} />
                        <Pie
                            data={processedData}
                            cx="50%"
                            cy="50%"
                            innerRadius={isDonut ? 60 : 0}
                            outerRadius={80}
                            paddingAngle={isDonut ? 5 : 0}
                            dataKey={config.y_column}
                            nameKey={config.x_column}
                            stroke="none"
                        >
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#color${index % GRADIENTS.length})`} />
                            ))}
                        </Pie>
                    </PieChart>
                );
            case "scatter":
                return (
                    <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
                        {renderDefs()}
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey={config.x_column} type="number" name={config.x_column} tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
                        <YAxis dataKey={config.y_column} type="number" name={config.y_column} tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={formatYAxis} width={50} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                        <Scatter name={config.title} data={processedData} fill={COLORS[1]} />
                    </ScatterChart>
                );
            case "area":
                return (
                    <AreaChart data={processedData} margin={{ top: 20, right: 20, left: 10, bottom: 60 }}>
                        {renderDefs()}
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey={config.x_column} tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} angle={-45} textAnchor="end" tickFormatter={truncateLabel} dx={-5} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={formatYAxis} width={50} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey={config.y_column} stroke={COLORS[2]} fill="url(#color2)" fillOpacity={1} strokeWidth={2} />
                    </AreaChart>
                );
            case "bar":
            default:
                return (
                    <BarChart data={processedData} margin={{ top: 20, right: 20, left: 10, bottom: 60 }}>
                        {renderDefs()}
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey={config.x_column} tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} angle={-45} textAnchor="end" tickFormatter={truncateLabel} dx={-5} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={formatYAxis} width={50} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                        <Bar dataKey={config.y_column} fill="url(#color0)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
        }
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
        </ResponsiveContainer>
    );
}
