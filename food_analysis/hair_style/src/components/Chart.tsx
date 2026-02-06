"use client"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"



type ChartBarProps<T extends Record<string, any>> = {
    data: T[];
    config: ChartConfig;
    xKey: keyof T;
    barKeys: (keyof T)[];
    height?: number;
    className?: string;
    tickFormatter?: (value: string) => string;
}

// const chartData = [
//     { month: "January", desktop: 186, mobile: 80 },
//     { month: "February", desktop: 305, mobile: 200 },
//     { month: "March", desktop: 237, mobile: 120 },
//     { month: "April", desktop: 73, mobile: 190 },
//     { month: "May", desktop: 209, mobile: 130 },
//     { month: "June", desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//     desktop: {
//         label: "Desktop",
//         color: "#2563eb",
//     },
//     mobile: {
//         label: "Mobile",
//         color: "#60a5fa",
//     },
// } satisfies ChartConfig

export function ChartBar<T extends Record<string, any>>(
    {
        data,
        config,
        xKey,
        barKeys,
        height = 200,
        className,
        tickFormatter
    }: ChartBarProps<T>
) {
    return (
        <ChartContainer
            config={config}
            className={cn(`min-h-[${height}px] w-full`, className)}>
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={xKey as string}
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={tickFormatter}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {barKeys.map((key) => (
                    <Bar
                        key={String(key)}
                        dataKey={key as string}
                        fill={`var(--color-${String(key)})`}
                        radius={4}
                    />
                ))}
            </BarChart>
        </ChartContainer>
    )
}
