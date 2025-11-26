"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetIncomeComparisonChart } from "@/components/tax/NetIncomeComparisonChart";
import { NetRateComparisonChart } from "@/components/tax/NetRateComparisonChart";
import { BurdenCompositionChart } from "@/components/tax/BurdenCompositionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    netIncome1995: number;
    netIncome2010: number;
    netIncome2025: number;
    rates1995: { gross: number; labor: number };
    rates2010: { gross: number; labor: number };
    rates2025: { gross: number; labor: number };
    burden1995: { incomeTax: number; residentTax: number; social: number };
    burden2010: { incomeTax: number; residentTax: number; social: number };
    burden2025: { incomeTax: number; residentTax: number; social: number };
};

export function GraphTabs({
    netIncome1995,
    netIncome2010,
    netIncome2025,
    rates1995,
    rates2010,
    rates2025,
    burden1995,
    burden2010,
    burden2025,
}: Props) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>グラフで見る変化</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="rate" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="rate">手取り率</TabsTrigger>
                        <TabsTrigger value="amount">手取り額</TabsTrigger>
                        <TabsTrigger value="burden">負担の内訳</TabsTrigger>
                    </TabsList>

                    <TabsContent value="rate" className="mt-0">
                        <NetRateComparisonChart
                            rates1995={rates1995}
                            rates2010={rates2010}
                            rates2025={rates2025}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            ※「人件費に対する手取り率」は、会社が負担する社会保険料を含めた総人件費のうち、何%が本人の手取りになるかを示しています。
                        </p>
                    </TabsContent>

                    <TabsContent value="amount" className="mt-0">
                        <NetIncomeComparisonChart
                            netIncome1995={netIncome1995}
                            netIncome2010={netIncome2010}
                            netIncome2025={netIncome2025}
                        />
                    </TabsContent>

                    <TabsContent value="burden" className="mt-0">
                        <BurdenCompositionChart
                            data1995={burden1995}
                            data2010={burden2010}
                            data2025={burden2025}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
