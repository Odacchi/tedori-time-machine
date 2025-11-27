"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetRateComparisonChart } from "@/components/tax/NetRateComparisonChart";
import { CompanyLaborCostChart } from "@/components/tax/CompanyLaborCostChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrialConditionsSummary } from "@/components/tax/TrialConditionsSummary";
import { TaxInput } from "@/domain/tax/model";

type Props = {
    input: TaxInput;
    rates1995: { gross: number; labor: number };
    rates2010: { gross: number; labor: number };
    rates2025: { gross: number; labor: number };
    laborCost1995: { net: number; incomeTax: number; residentTax: number; employeeSocial: number; employerSocial: number };
    laborCost2010: { net: number; incomeTax: number; residentTax: number; employeeSocial: number; employerSocial: number };
    laborCost2025: { net: number; incomeTax: number; residentTax: number; employeeSocial: number; employerSocial: number };
};

export function GraphTabs({
    input,
    rates1995,
    rates2010,
    rates2025,
    laborCost1995,
    laborCost2010,
    laborCost2025,
}: Props) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>グラフで見る変化</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="rate" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="rate">手取り率</TabsTrigger>
                        <TabsTrigger value="labor">会社の人件費内訳</TabsTrigger>
                    </TabsList>
                    <TrialConditionsSummary input={input} />

                    <TabsContent value="rate" className="mt-0">
                        <NetRateComparisonChart
                            rates1995={rates1995}
                            rates2010={rates2010}
                            rates2025={rates2025}
                        />
                    </TabsContent>

                    <TabsContent value="labor" className="mt-0">
                        <CompanyLaborCostChart
                            data1995={laborCost1995}
                            data2010={laborCost2010}
                            data2025={laborCost2025}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
