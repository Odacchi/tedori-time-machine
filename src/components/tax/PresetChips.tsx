"use client";

import { Button } from "@/components/ui/button";
import { PRESET_SCENARIOS } from "@/domain/tax/presets";
import { TaxInput } from "@/domain/tax/model";

type Props = {
    onSelect: (value: Partial<TaxInput>) => void;
};

export function PresetChips({ onSelect }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium self-center mr-2">よくある例:</span>
            {PRESET_SCENARIOS.map((preset) => (
                <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(preset.input)}
                    className="rounded-full transition-transform active:translate-y-px active:bg-accent active:text-accent-foreground"
                    title={preset.description}
                >
                    {preset.label}
                </Button>
            ))}
        </div>
    );
}
