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

    assert.equal(result.netIncome, 8_259_056);
    assert.equal(result.incomeTax, 1_045_118);
    assert.equal(result.residentTax, 721_575);
});

test("2025: spouse deduction removed when salary income > 10M", () => {
    const result = calculateForPreset(
        { ...baseInput, annualSalary: 12_000_000 },
        "2025",
    ).breakdown;

    assert.equal(result.netIncome, 8_187_861);
    assert.equal(result.incomeTax, 1_154_138);
    assert.equal(result.residentTax, 768_000);
});

test("2010: spouse deduction still applies without income limit", () => {
    const result = calculateForPreset(
        { ...baseInput, annualSalary: 12_000_000 },
        "2010",
    ).breakdown;

    assert.equal(result.netIncome, 8_621_760);
    assert.equal(result.incomeTax, 1_003_440);
    assert.equal(result.residentTax, 712_800);
});

test("2025: no spouse deduction when spouse is 'none' (11.9M)", () => {
    const result = calculateForPreset(
        { ...baseInput, spouse: "none", annualSalary: 11_900_000 },
        "2025",
    ).breakdown;

    // 配偶者あり（8,259,056）より約12.7万円低い＝別テストで控除が効いていることを確認
    assert.equal(result.netIncome, 8_131_821);
});

test("2025: no spouse deduction when spouse is 'none' (12.0M)", () => {
    const result = calculateForPreset(
        { ...baseInput, spouse: "none", annualSalary: 12_000_000 },
        "2025",
    ).breakdown;

    // 配偶者あり12.0M時（8,187,861）と同額＝別テストで控除が既に外れていることを確認
    assert.equal(result.netIncome, 8_187_861);
});
