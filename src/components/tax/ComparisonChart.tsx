"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { TaxInput, TaxResult } from "@/domain/tax/model";
import { TrialConditionsSummary } from "./TrialConditionsSummary";
import { useImageCapture } from "@/hooks/useImageCapture";
import { SaveImageButton } from "@/components/tax/SaveImageButton";
import { cn } from "@/lib/utils";
import { CardFooter } from "@/components/ui/card";

type ScenarioData = {
    id: string;
    label: string;
    input: TaxInput;
    result: TaxResult;
};

type Props = {
    scenarios: ScenarioData[];
    yearLabel: string;
};

export function ComparisonChart({ scenarios, yearLabel }: Props) {
    const { captureRef, capture, isCapturing, isSaving } = useImageCapture({
        fileName: `tedori-comparison-${yearLabel}.png`,
    });

    const data = scenarios.map((s) => ({
        name: s.label,
        net: s.result.breakdown.netIncome,
        tax: s.result.breakdown.incomeTax + s.result.breakdown.residentTax,
        social: s.result.breakdown.employeeSocialInsurance,
        total:
            s.result.breakdown.netIncome +
            s.result.breakdown.incomeTax +
            s.result.breakdown.residentTax +
            s.result.breakdown.employeeSocialInsurance,
    }));

    const series = [
        { key: "net", name: "手取り", color: "#8aa3f5" },
        { key: "tax", name: "税金", color: "#7dc6a1" },
        { key: "social", name: "社会保険料", color: "#e58c8c" },
    ] as const;

    const totalFormatter = (value: number) => `${(value / 10000).toFixed(1)}万`;

    return (
        <div ref={captureRef} className="relative bg-white">
            <Card className={cn("w-full shadow-sm gap-0", isCapturing && "shadow-none border-none")}>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart3 className="w-5 h-5 text-slate-500" />
                        {yearLabel}の手取り比較
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        各シナリオの手取り額・税金・社会保険料の比較
                    </p>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                // 左にラベル用の余白だけ確保
                                margin={{ top: 16, right: 36, left: 100, bottom: 12 }}
                                stackOffset="sign"
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis
                                    type="number"
                                    tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
                                    domain={[0, "auto"]}
                                    fontSize={12}
                                />
                                {/* 軸は位置決めだけ。ラベルは描かない */}
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={0}
                                    tick={false}
                                    tickLine={false}
                                    axisLine={false}
                                />

                                <Legend
                                    wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                                    itemSorter={null}
                                />
                                <Tooltip
                                    formatter={(value: number, key) => {
                                        const labelMap: Record<string, string> = {
                                            net: "手取り",
                                            tax: "税金",
                                            social: "社会保険料",
                                        };
                                        return [`${value.toLocaleString()}円`, labelMap[key as string] ?? key];
                                    }}
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                                />

                                {series.map((item, idx) => {
                                    const isLast = idx === series.length - 1;
                                    const radius: [number, number, number, number] = isLast
                                        ? [0, 4, 4, 0]
                                        : [0, 0, 0, 0];

                                    return (
                                        <Bar
                                            key={item.key}
                                            dataKey={item.key}
                                            name={item.name}
                                            stackId="a"
                                            fill={item.color}
                                            radius={radius}
                                            barSize={32}
                                        >
                                            {/* 中央の「◯◯万」ラベル（これまで通り） */}
                                            <LabelList
                                                dataKey={item.key}
                                                content={({ x, y, width, height, value }) => {
                                                    const num = Number(value);
                                                    if (Number.isNaN(num) || Number(width) < 40) return null;
                                                    return (
                                                        <text
                                                            x={Number(x) + Number(width) / 2}
                                                            y={Number(y) + Number(height) / 2}
                                                            textAnchor="middle"
                                                            fill="#fff"
                                                            fontSize={11}
                                                            fontWeight={600}
                                                            dominantBaseline="middle"
                                                        >
                                                            {totalFormatter(num)}
                                                        </text>
                                                    );
                                                }}
                                            />

                                            {/* 一番左側のシナリオ名ラベルは net のバーにだけ付ける */}
                                            {item.key === "net" && (
                                                <LabelList
                                                    dataKey="name"
                                                    content={({ y, height, value }) => {
                                                        if (y == null || height == null) return null;
                                                        return (
                                                            <text
                                                                x={8}
                                                                y={Number(y) + Number(height) / 2}
                                                                textAnchor="start"
                                                                fill="#64748b"
                                                                fontSize={12}
                                                                dominantBaseline="middle"
                                                            >
                                                                {String(value)}
                                                            </text>
                                                        );
                                                    }}
                                                />
                                            )}
                                        </Bar>
                                    );
                                })}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend / Summaries */}
                    <div className="bg-slate-50 rounded-lg border p-4 space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                            比較シナリオの条件一覧
                        </h3>
                        {scenarios.map((scenario) => (
                            <TrialConditionsSummary
                                key={scenario.id}
                                input={scenario.input}
                                label={scenario.label}
                                className="border-b last:border-0 border-slate-200 pb-3 last:pb-0"
                            />
                        ))}
                    </div>
                </CardContent>
                <CardFooter className={cn("pt-0 pb-4", isCapturing && "hidden")} data-ignore-capture="true">
                    <SaveImageButton
                        className="w-full text-xs h-9"
                        onClick={() => capture()}
                        isSaving={isSaving}
                    />
                </CardFooter>
            </Card>
            {isCapturing && (
                <div className="absolute right-6 bottom-4 text-[11px] font-semibold text-slate-600 pointer-events-none select-none">
                    手取りタイムマシン
                </div>
            )}
        </div>
    );
}