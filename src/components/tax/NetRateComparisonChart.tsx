"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

type Props = {
    rates1995: { gross: number; labor: number };
    rates2010: { gross: number; labor: number };
    rates2025: { gross: number; labor: number };
    rates2040: { gross: number; labor: number };
};

export function NetRateComparisonChart({ rates1995, rates2010, rates2025, rates2040 }: Props) {
    const data = [
        {
            name: "1995年",
            gross: Math.round(rates1995.gross * 1000) / 10,
            labor: Math.round(rates1995.labor * 1000) / 10,
        },
        {
            name: "2010年",
            gross: Math.round(rates2010.gross * 1000) / 10,
            labor: Math.round(rates2010.labor * 1000) / 10,
        },
        {
            name: "2025年",
            gross: Math.round(rates2025.gross * 1000) / 10,
            labor: Math.round(rates2025.labor * 1000) / 10,
        },
        {
            name: "2040年",
            gross: Math.round(rates2040.gross * 1000) / 10,
            labor: Math.round(rates2040.labor * 1000) / 10,
        },
    ];

    return (
        <Card className="w-full shadow-sm gap-0">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="w-5 h-5 text-slate-500" />
                    手取り率の変化
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    「額面」と「会社があなたのために支払うお金」に対して、それぞれどれだけが手取りになるかの比較
                </p>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 16, right: 36, left: 0, bottom: 12 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" unit="%" domain={[0, 100]} fontSize={12} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={60}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                formatter={(value: number) => [`${value}%`, ""]}
                                cursor={{ fill: "transparent" }}
                                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                            />
                            <Bar dataKey="gross" name="手取り / 額面" fill="#8aa3f5" radius={[0, 4, 4, 0]} barSize={24}>
                                <LabelList
                                    dataKey="gross"
                                    position="right"
                                    formatter={(value: unknown) => {
                                        const num = typeof value === "number" ? value : Number(value);
                                        if (Number.isNaN(num)) return "";
                                        return `${num.toFixed(1)}%`;
                                    }}
                                    className="text-[11px] fill-slate-700 font-semibold"
                                />
                            </Bar>
                            <Bar dataKey="labor" name="手取り / 人件費" fill="#7dc6a1" radius={[0, 4, 4, 0]} barSize={24}>
                                <LabelList
                                    dataKey="labor"
                                    position="right"
                                    formatter={(value: unknown) => {
                                        const num = typeof value === "number" ? value : Number(value);
                                        if (Number.isNaN(num)) return "";
                                        return `${num.toFixed(1)}%`;
                                    }}
                                    className="text-[11px] fill-slate-700 font-semibold"
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#8aa3f5] rounded-sm" />
                        <span>対 額面</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#7dc6a1] rounded-sm" />
                        <span>対 人件費</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
