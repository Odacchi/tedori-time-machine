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
    rates1995: { gross: number; labor: number };
    rates2010: { gross: number; labor: number };
    rates2025: { gross: number; labor: number };
};

export function NetRateComparisonChart({ rates1995, rates2010, rates2025 }: Props) {
    const data = [
        {
            name: "1995年頃",
            gross: Math.round(rates1995.gross * 1000) / 10,
            labor: Math.round(rates1995.labor * 1000) / 10,
        },
        {
            name: "2010年頃",
            gross: Math.round(rates2010.gross * 1000) / 10,
            labor: Math.round(rates2010.labor * 1000) / 10,
        },
        {
            name: "現在 (2025)",
            gross: Math.round(rates2025.gross * 1000) / 10,
            labor: Math.round(rates2025.labor * 1000) / 10,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>「額面」と「会社の人件費」のうち、どれだけが手取りになるか</CardTitle>
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
                        <YAxis unit="%" domain={[0, 100]} width={40} />
                        <Tooltip
                            formatter={(value: number) => [`${value}%`, ""]}
                            cursor={{ fill: "transparent" }}
                        />
                        <Legend />
                        <Bar dataKey="gross" name="手取り / 額面" fill="#8aa3f5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="labor" name="手取り / 人件費" fill="#7dc6a1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
