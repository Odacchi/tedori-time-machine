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

test("2040: social insurance is 1.6x of 2025", () => {
    const input2025 = { ...baseInput, annualSalary: 6_000_000 };
    const result2025 = calculateForPreset(input2025, "2025").breakdown;
    const result2040 = calculateForPreset(input2025, "2040").breakdown;

    // 2025 Social Insurance
    const social2025 = result2025.employeeSocialInsurance;
    // 2040 Social Insurance should be ~1.6x
    const social2040 = result2040.employeeSocialInsurance;

    // Allow small rounding diffs.
    // Note: Unemployment insurance (0.6%) is NOT multiplied by 1.6, so the total ratio is slightly less than 1.6.
    // 2025 Rate (Over 40): 9.15 + 5.0 + 1.0 + 0.6 = 15.75%
    // 2040 Rate (Over 40): (9.15 + 5.0 + 1.0)*1.6 + 0.6 = 24.24 + 0.6 = 24.84%
    // Ratio: 24.84 / 15.75 = 1.5771...
    const ratio = social2040 / social2025;
    assert.ok(ratio > 1.57 && ratio < 1.58, `Ratio ${ratio} should be close to 1.577`);

    // Net income should be lower
    assert.ok(result2040.netIncome < result2025.netIncome);
});
