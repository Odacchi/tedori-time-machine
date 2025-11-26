import assert from "node:assert/strict";
import test from "node:test";

import { calculateForPreset } from "../../../src/domain/tax/calculator";

const baseInput = {
    isOver40: true,
    spouse: "dependent" as const,
    children: { under16: 0, age16to18: 0, age19to23: 0 },
};

test("2025: spouse deduction applies when salary income <= 10M", () => {
    const result = calculateForPreset(
        { ...baseInput, annualSalary: 11_900_000 },
        "2025",
    ).breakdown;

    assert.equal(result.netIncome, 8_144_281);
    assert.equal(result.incomeTax, 1_004_598);
    assert.equal(result.residentTax, 704_320);
});

test("2025: spouse deduction removed when salary income > 10M", () => {
    const result = calculateForPreset(
        { ...baseInput, annualSalary: 12_000_000 },
        "2025",
    ).breakdown;

    assert.equal(result.netIncome, 8_072_122);
    assert.equal(result.incomeTax, 1_113_277);
    assert.equal(result.residentTax, 750_600);
});

test("2010: spouse deduction still applies without income limit", () => {
    const result = calculateForPreset(
        { ...baseInput, annualSalary: 12_000_000 },
        "2010",
    ).breakdown;

    assert.equal(result.netIncome, 8_388_420);
    assert.equal(result.incomeTax, 1_094_980);
    assert.equal(result.residentTax, 752_600);
});
