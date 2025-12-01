"use client";

import { useEffect, useState } from "react";
import { TaxInput } from "@/domain/tax/model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PresetChips } from "./PresetChips";
import { Settings2 } from "lucide-react";

type Props = {
    value: TaxInput;
    onChange: (value: TaxInput) => void;
};

export function TaxForm({
    value,
    onChange,
    idPrefix = "",
    variant = "card",
}: Props & { idPrefix?: string; variant?: "card" | "plain" }) {
    const handleChange = (key: keyof TaxInput, val: any) => {
        onChange({ ...value, [key]: val });
    };

    // ... (handlers)

    const handleChildChange = (key: keyof TaxInput["children"], val: number) => {
        onChange({
            ...value,
            children: { ...value.children, [key]: Math.max(0, val) },
        });
    };

    const handlePresetSelect = (partial: Partial<TaxInput>) => {
        onChange({ ...value, ...partial });
    };

    const formatNumber = (num: number) => (Number.isFinite(num) ? String(num) : "0");

    const [salaryInput, setSalaryInput] = useState<string>(() => formatNumber(value.annualSalary / 10000));
    const [childInputs, setChildInputs] = useState<{
        under16: string;
        age16to18: string;
        age19to23: string;
    }>(() => ({
        under16: formatNumber(value.children.under16),
        age16to18: formatNumber(value.children.age16to18),
        age19to23: formatNumber(value.children.age19to23),
    }));

    // Sync local input text when preset/URL changes parent value
    useEffect(() => {
        setSalaryInput(formatNumber(value.annualSalary / 10000));
        setChildInputs({
            under16: formatNumber(value.children.under16),
            age16to18: formatNumber(value.children.age16to18),
            age19to23: formatNumber(value.children.age19to23),
        });
    }, [value]);

    const p = (id: string) => (idPrefix ? `${idPrefix}-${id}` : id);

    const content = (
        <div className="space-y-6">
            {/* Presets */}
            <div className="bg-muted/30 p-4 rounded-lg border">
                <PresetChips onSelect={handlePresetSelect} />
            </div>

            {/* Annual Salary */}
            <div className="space-y-2">
                <Label htmlFor={p("salary")}>年収（額面・万円）</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id={p("salary")}
                        type="number"
                        min={0}
                        step={10}
                        value={salaryInput}
                        onChange={(e) => {
                            const raw = e.target.value;
                            setSalaryInput(raw);
                            if (raw === "") return;
                            const num = Number(raw);
                            if (!Number.isNaN(num)) handleChange("annualSalary", num * 10000);
                        }}
                        onBlur={(e) => {
                            if (e.target.value === "") {
                                setSalaryInput("0");
                                handleChange("annualSalary", 0);
                            }
                        }}
                        className="text-lg"
                    />
                    <span className="text-sm text-muted-foreground">万円</span>
                </div>
            </div>

            {/* Age Check */}
            <div className="flex items-center space-x-2 border p-4 rounded-md">
                <input
                    type="checkbox"
                    id={p("isOver40")}
                    checked={value.isOver40}
                    onChange={(e) => handleChange("isOver40", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={p("isOver40")} className="cursor-pointer font-medium">
                    40歳以上（介護保険料あり）
                </Label>
            </div>

            {/* Spouse */}
            <div className="space-y-2">
                <Label>配偶者</Label>
                <RadioGroup
                    value={value.spouse === "dependent" ? "dependent" : "none"}
                    onValueChange={(val) =>
                        handleChange("spouse", val === "dependent" ? "dependent" : "none")
                    }
                    className="flex gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id={p("sp-none")} />
                        <Label htmlFor={p("sp-none")}>なし / 共働き（扶養外）</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dependent" id={p("sp-dep")} />
                        <Label htmlFor={p("sp-dep")}>扶養あり</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Children */}
            <div className="space-y-3">
                <Label>子どもの人数</Label>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor={p("c0")} className="text-xs text-muted-foreground">
                            0〜15歳
                        </Label>
                        <Input
                            id={p("c0")}
                            type="number"
                            min={0}
                            value={childInputs.under16}
                            onChange={(e) => {
                                const raw = e.target.value;
                                setChildInputs((prev) => ({ ...prev, under16: raw }));
                                if (raw === "") return;
                                const num = Math.max(0, Number(raw));
                                if (!Number.isNaN(num)) handleChildChange("under16", num);
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "") {
                                    setChildInputs((prev) => ({ ...prev, under16: "0" }));
                                    handleChildChange("under16", 0);
                                }
                            }}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={p("c1")} className="text-xs text-muted-foreground">
                            16〜18歳
                        </Label>
                        <Input
                            id={p("c1")}
                            type="number"
                            min={0}
                            value={childInputs.age16to18}
                            onChange={(e) => {
                                const raw = e.target.value;
                                setChildInputs((prev) => ({ ...prev, age16to18: raw }));
                                if (raw === "") return;
                                const num = Math.max(0, Number(raw));
                                if (!Number.isNaN(num)) handleChildChange("age16to18", num);
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "") {
                                    setChildInputs((prev) => ({ ...prev, age16to18: "0" }));
                                    handleChildChange("age16to18", 0);
                                }
                            }}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={p("c2")} className="text-xs text-muted-foreground">
                            19〜23歳
                        </Label>
                        <Input
                            id={p("c2")}
                            type="number"
                            min={0}
                            value={childInputs.age19to23}
                            onChange={(e) => {
                                const raw = e.target.value;
                                setChildInputs((prev) => ({ ...prev, age19to23: raw }));
                                if (raw === "") return;
                                const num = Math.max(0, Number(raw));
                                if (!Number.isNaN(num)) handleChildChange("age19to23", num);
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "") {
                                    setChildInputs((prev) => ({ ...prev, age19to23: "0" }));
                                    handleChildChange("age19to23", 0);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    if (variant === "plain") {
        return content;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5" />
                    条件を入力
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {content}
            </CardContent>
        </Card>
    );
}
