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

type Props = {
    data1995: { incomeTax: number; residentTax: number; social: number };
    data2010: { incomeTax: number; residentTax: number; social: number };
    data2025: { incomeTax: number; residentTax: number; social: number };
};

export function BurdenCompositionChart({ data1995, data2010, data2025 }: Props) {
    const data = [
        {
            name: "1995年頃",
            ...data1995,
        },
        {
            name: "2010年頃",
            ...data2010,
        },
        {
            name: "現在 (2025)",
            ...data2025,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>税金と社会保険料の内訳（負担増の要因）</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 16, right: 20, left: 20, bottom: 12 }}
                        stackOffset="sign"
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis
                            type="number"
                            tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={88}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value.toLocaleString()}円`, ""]}
                            cursor={{ fill: "transparent" }}
                        />
                        <Bar dataKey="incomeTax" name="所得税" stackId="a" fill="#8aa3f5" radius={[0, 0, 0, 0]}>
                            <LabelList
                                dataKey="incomeTax"
                                position="right"
                                formatter={(value: unknown) => {
                                    const num = typeof value === "number" ? value : Number(value);
                                    if (Number.isNaN(num)) return "";
                                    return `所得税 ${(num / 10000).toFixed(1)}万`;
                                }}
                                className="text-[11px] fill-slate-700 font-semibold"
                            />
                        </Bar>
                        <Bar dataKey="residentTax" name="住民税" stackId="a" fill="#7dc6a1" radius={[0, 0, 0, 0]}>
                            <LabelList
                                dataKey="residentTax"
                                position="right"
                                formatter={(value: unknown) => {
                                    const num = typeof value === "number" ? value : Number(value);
                                    if (Number.isNaN(num)) return "";
                                    return `住民税 ${(num / 10000).toFixed(1)}万`;
                                }}
                                className="text-[11px] fill-slate-700 font-semibold"
                            />
                        </Bar>
                        <Bar dataKey="social" name="社会保険料" stackId="a" fill="#e58c8c" radius={[0, 4, 4, 0]}>
                            <LabelList
                                dataKey="social"
                                position="right"
                                formatter={(value: unknown) => {
                                    const num = typeof value === "number" ? value : Number(value);
                                    if (Number.isNaN(num)) return "";
                                    return `社会保険料 ${(num / 10000).toFixed(1)}万`;
                                }}
                                className="text-[11px] fill-slate-700 font-semibold"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
