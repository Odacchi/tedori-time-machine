"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    netIncome1995: number;
    netIncome2010: number;
    netIncome2025: number;
};

export function NetIncomeComparisonChart({ netIncome1995, netIncome2010, netIncome2025 }: Props) {
    const data = [
        {
            name: "1995年頃",
            value: netIncome1995,
        },
        {
            name: "2010年頃",
            value: netIncome2010,
        },
        {
            name: "現在 (2025)",
            value: netIncome2025,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>手取り（年額）の比較</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis
                            tickFormatter={(value) => `${value / 10000}万`}
                            width={60}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value.toLocaleString()}円`, "手取り"]}
                            cursor={{ fill: "transparent" }}
                        />
                        <Bar dataKey="value" name="手取り" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === 0 ? "#8aa3f5" : index === 1 ? "#7dc6a1" : "#e58c8c"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
