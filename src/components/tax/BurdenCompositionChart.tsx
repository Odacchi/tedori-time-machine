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
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        stackOffset="sign"
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis
                            tickFormatter={(value) => `${value / 10000}万`}
                            width={60}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value.toLocaleString()}円`, ""]}
                            cursor={{ fill: "transparent" }}
                        />
                        <Legend />
                        <Bar dataKey="incomeTax" name="所得税" stackId="a" fill="#8aa3f5" />
                        <Bar dataKey="residentTax" name="住民税" stackId="a" fill="#7dc6a1" />
                        <Bar dataKey="social" name="社会保険料" stackId="a" fill="#e58c8c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
