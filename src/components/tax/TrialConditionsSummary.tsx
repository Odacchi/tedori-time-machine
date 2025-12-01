"use client";

import { TaxInput } from "@/domain/tax/model";
import { cn } from "@/lib/utils";

type Props = {
    input: TaxInput;
    className?: string;
};

export function TrialConditionsSummary({
    input,
    className,
    label,
    showPrefix = true,
}: Props & { label?: string; showPrefix?: boolean }) {
    const totalChildren = input.children.under16 + input.children.age16to18 + input.children.age19to23;
    const spouseText = input.spouse === "dependent" ? "既婚（配偶者扶養あり）" : "独身（配偶者扶養なし）";
    const careText = input.isOver40 ? "介護保険料：あり（40歳以上）" : "介護保険料：なし（40歳未満）";
    const salaryText = `額面 ${(input.annualSalary / 10000).toLocaleString()}万円`;
    const childrenText = `子ども ${totalChildren}人`;

    const pills = [salaryText, spouseText, childrenText, careText];

    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground", className)}>
            {(showPrefix || label) && (
                <span className="font-semibold text-foreground text-xs sm:text-sm whitespace-nowrap">
                    {label || "試算条件："}
                </span>
            )}
            <div className="flex flex-wrap items-center gap-2">
                {pills.map((text) => (
                    <span
                        key={text}
                        className="rounded-full border bg-muted px-3 py-1 text-xs font-medium text-foreground/80 whitespace-nowrap"
                    >
                        {text}
                    </span>
                ))}
            </div>
        </div>
    );
}
