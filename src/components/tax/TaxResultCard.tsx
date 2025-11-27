"use client";

import { useState } from "react";
import { TaxResult } from "@/domain/tax/model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
    result: TaxResult;
    title: string;
};

export function TaxResultCard({ result, title }: Props) {
    const { breakdown } = result;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Key Metrics (Always Visible) */}
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm text-muted-foreground">手取り (Net)</span>
                        <span className="text-xl font-bold">{breakdown.netIncome.toLocaleString()}円</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">人件費に対する手取り率</span>
                        <span className="font-semibold">{(breakdown.netRateOnLaborCost * 100).toFixed(1)}%</span>
                    </div>
                </div>

                {/* Details Toggle */}
                <div className="pt-2 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground h-8"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                詳細を閉じる
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                詳細な内訳を見る
                            </>
                        )}
                    </Button>

                    {isOpen && (
                        <div className="space-y-2 text-sm mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex justify-between py-1 border-b">
                                <span className="text-muted-foreground">額面年収</span>
                                <span>{(breakdown.netIncome + breakdown.incomeTax + breakdown.residentTax + breakdown.employeeSocialInsurance).toLocaleString()}円</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>所得税</span>
                                <span>{breakdown.incomeTax.toLocaleString()}円</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>住民税</span>
                                <span>{breakdown.residentTax.toLocaleString()}円</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>社会保険料（本人）</span>
                                <span>{breakdown.employeeSocialInsurance.toLocaleString()}円</span>
                            </div>

                            <div className="flex justify-between py-1 text-muted-foreground border-t border-dashed mt-2 pt-2">
                                <span>社会保険料（会社）</span>
                                <span>{breakdown.employerSocialInsurance.toLocaleString()}円</span>
                            </div>
                            <div className="flex justify-between py-1 text-muted-foreground">
                                <span>人件費総額</span>
                                <span>{breakdown.totalLaborCost.toLocaleString()}円</span>
                            </div>

                            <div className="flex justify-between py-1 text-xs text-muted-foreground mt-2 border-t pt-2">
                                <span>手取り / 額面</span>
                                <span>{(breakdown.netRateOnGross * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
