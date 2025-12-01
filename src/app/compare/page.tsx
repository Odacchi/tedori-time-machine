"use client";

import { useState } from "react";
import { TaxInput, TaxYearPreset } from "@/domain/tax/model";
import { calculateForPreset } from "@/domain/tax/calculator";
import { TaxForm } from "@/components/tax/TaxForm";
import { ComparisonChart } from "@/components/tax/ComparisonChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Scenario = {
    id: string;
    label: string;
    input: TaxInput;
};

const DEFAULT_INPUT: TaxInput = {
    annualSalary: 5000000,
    isOver40: false,
    spouse: "none",
    children: {
        under16: 0,
        age16to18: 0,
        age19to23: 0,
    },
};

export default function ComparePage() {
    const [scenarios, setScenarios] = useState<Scenario[]>([
        { id: "s1", label: "シナリオ1", input: { ...DEFAULT_INPUT } },
    ]);
    const [targetYear, setTargetYear] = useState<TaxYearPreset>("2025");

    const addScenario = () => {
        if (scenarios.length >= 4) return;
        const lastScenario = scenarios[scenarios.length - 1];
        const newId = `s${Date.now()}`;
        setScenarios([
            ...scenarios,
            {
                id: newId,
                label: `シナリオ${scenarios.length + 1}`,
                input: { ...lastScenario.input }, // Copy last input
            },
        ]);
    };

    const removeScenario = (id: string) => {
        if (scenarios.length <= 1) return;
        setScenarios(scenarios.filter((s) => s.id !== id));
    };

    const updateScenarioInput = (id: string, input: TaxInput) => {
        setScenarios(scenarios.map((s) => (s.id === id ? { ...s, input } : s)));
    };

    const updateScenarioLabel = (id: string, label: string) => {
        setScenarios(scenarios.map((s) => (s.id === id ? { ...s, label } : s)));
    };

    // Calculate results
    const results = scenarios.map((s) => ({
        id: s.id,
        label: s.label,
        input: s.input,
        result: calculateForPreset(s.input, targetYear),
    }));

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="font-bold text-lg">手取りシミュレーション比較</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Year Selector */}
                <div className="flex justify-center">
                    <Tabs
                        value={targetYear}
                        onValueChange={(v) => setTargetYear(v as TaxYearPreset)}
                        className="w-full max-w-md"
                    >
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="1995">1995年</TabsTrigger>
                            <TabsTrigger value="2010">2010年</TabsTrigger>
                            <TabsTrigger value="2025">2025年</TabsTrigger>
                            <TabsTrigger value="2040">2040年</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Chart Area */}
                <section className="space-y-4">
                    <ComparisonChart scenarios={results} yearLabel={`${targetYear}年`} />
                </section>

                {/* Scenarios Input Area */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">条件セット ({scenarios.length}/4)</h2>
                        <Button
                            onClick={addScenario}
                            disabled={scenarios.length >= 4}
                            variant="outline"
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            条件を追加
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {scenarios.map((scenario, index) => (
                            <div key={scenario.id} className="space-y-2">
                                <Card className="border-l-4 border-l-primary/20 overflow-hidden">
                                    <div className="bg-slate-100 px-4 py-3 flex items-center gap-3 border-b">
                                        <div className="flex-1">
                                            <Label htmlFor={`label-${scenario.id}`} className="sr-only">
                                                シナリオ名
                                            </Label>
                                            <Input
                                                id={`label-${scenario.id}`}
                                                value={scenario.label}
                                                onChange={(e) => updateScenarioLabel(scenario.id, e.target.value)}
                                                className="h-8 bg-white"
                                                placeholder="シナリオ名"
                                            />
                                        </div>
                                        {scenarios.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeScenario(scenario.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <TaxForm
                                            value={scenario.input}
                                            onChange={(val) => updateScenarioInput(scenario.id, val)}
                                            idPrefix={scenario.id}
                                            variant="plain"
                                        />
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
