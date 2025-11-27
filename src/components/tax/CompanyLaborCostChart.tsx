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
import { Briefcase } from "lucide-react";

type LaborCostData = {
    net: number;
    incomeTax: number;
    residentTax: number;
    employeeSocial: number;
    employerSocial: number;
    total?: number;
};

type Props = {
    data1995: LaborCostData;
    data2010: LaborCostData;
    data2025: LaborCostData;
};

export function CompanyLaborCostChart({ data1995, data2010, data2025 }: Props) {
    const series = [
        { key: "net", name: "手取り", color: "#8aa3f5" },
        { key: "incomeTax", name: "所得税", color: "#6b7fd7" },
        { key: "residentTax", name: "住民税", color: "#5fb28c" },
        { key: "employeeSocial", name: "社会保険料（本人）", color: "#f29c9c" },
        { key: "employerSocial", name: "社会保険料（会社）", color: "#f5c06a" },
    ] as const;

    const data = [
        { name: "1995年", ...data1995 },
        { name: "2010年", ...data2010 },
        { name: "2025年", ...data2025 },
    ];

    const withTotal = data.map((item) => ({
        ...item,
        total: item.net + item.incomeTax + item.residentTax + item.employeeSocial + item.employerSocial,
    }));

    const totalFormatter = (value: number) => `${(value / 10000).toFixed(1)}万`;

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Briefcase className="w-5 h-5 text-slate-500" />
                    人件費内訳の変化
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    会社があなたのために支払うお金の中で、手取り・税金・社会保険料（本人＋会社負担）がどのくらいの割合かを比較
                </p>
            </CardHeader>
            <CardContent>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={withTotal}
                            layout="vertical"
                            margin={{ top: 16, right: 36, left: 0, bottom: 12 }}
                            stackOffset="none"
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis
                                type="number"
                                tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
                                domain={[0, (max: number) => max * 1.10]}
                                fontSize={12}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={60}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                            axisLine={false}
                        />
                        <Legend
                            itemSorter={null}
                            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                        />
                            <Tooltip
                                formatter={(value: number, key) => {
                                    const label = key as keyof LaborCostData;
                                    const labels: Record<keyof LaborCostData, string> = {
                                        net: "手取り",
                                        incomeTax: "所得税",
                                        residentTax: "住民税",
                                        employeeSocial: "社会保険料（本人）",
                                        employerSocial: "社会保険料（会社）",
                                        total: "人件費",
                                    };
                                    return [`${value.toLocaleString()}円`, labels[label] ?? key];
                                }}
                                cursor={{ fill: "transparent" }}
                                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                            />
                            {series.map((item, idx) => {
                                const isTop = idx === series.length - 1;
                                const radius: [number, number, number, number] =
                                    isTop && item.key === "employerSocial" ? [0, 4, 4, 0] : isTop ? [4, 4, 0, 0] : [0, 0, 0, 0];
                                const isNet = item.key === "net";
                                return (
                                    <Bar
                                        key={item.key}
                                        dataKey={item.key}
                                        name={item.name}
                                        stackId="labor"
                                        fill={item.color}
                                        radius={radius}
                                        barSize={24}
                                    >
                                        <LabelList
                                            dataKey={item.key}
                                            content={({ x = 0, y = 0, width = 0, height = 0, value }) => {
                                                const num = typeof value === "number" ? value : Number(value);
                                                if (Number.isNaN(num)) return null;
                                                const widthNum = typeof width === "number" ? width : Number(width);
                                                // avoid cramped labels on very small segments
                                                if (widthNum < 36) return null;
                                                const xNum = typeof x === "number" ? x : Number(x);
                                                const yNum = typeof y === "number" ? y : Number(y);
                                                const heightNum = typeof height === "number" ? height : Number(height);
                                                const cx = (Number.isNaN(xNum) ? 0 : xNum) + (Number.isNaN(widthNum) ? 0 : widthNum) - 6;
                                                const cy = (Number.isNaN(yNum) ? 0 : yNum) + (Number.isNaN(heightNum) ? 0 : heightNum / 2);
                                                const labelText = item.key === "net" ? `${item.name} ${totalFormatter(num)}` : totalFormatter(num);
                                                return (
                                                    <text
                                                        x={cx}
                                                        y={cy}
                                                        textAnchor="end"
                                                        fill="#0f172a"
                                                        fontSize={11}
                                                        fontWeight={600}
                                                        dominantBaseline="middle"
                                                    >
                                                        {labelText}
                                                    </text>
                                                );
                                            }}
                                        />
                                        {isTop && (
                                            <LabelList
                                                dataKey="total"
                                                position="right"
                                                formatter={(value: unknown) => {
                                                    const num = typeof value === "number" ? value : Number(value);
                                                    if (Number.isNaN(num)) return "";
                                                    return `人件費\n${totalFormatter(num)}`;
                                                }}
                                                className="text-[11px] fill-slate-700 font-semibold"
                                            />
                                        )}
                                    </Bar>
                                );
                            })}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
