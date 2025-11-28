import { TaxRuleSet } from "../model";

// NOTE: Approximate values for ~2025
export const rules2025: TaxRuleSet = {
    basicDeduction: 480000, // Increased in recent reforms
    spouseDeduction: 380000,
    spouseDeductionIncomeLimit: 10_000_000,
    childDeductions: {
        under16: 0, // Abolished (replaced by Child Allowance, but that's separate from tax deduction usually)
        age16to18: 380000, // General dependent (16-18 is now general, 19-22 is specific)
        age19to23: 630000, // Specific dependent (19-22)
    },
    socialInsurance: {
        // 厚生年金：総率 18.3% を折半イメージ
        pension: {
            employee: 0.0915,
            employer: 0.0915,
        },
        // 健康保険：協会けんぽ（東京 or 平均）をイメージして総率 ≒9.7%〜10%
        health: {
            employee: 0.05,
            employer: 0.05,
        },
        // 雇用保険：本人 ≒0.6%、会社 ≒0.9% くらい
        unemployment: {
            employee: 0.006,
            employer: 0.009,
        },
        // 介護保険：合計 ≒2.0% 前後を想定して 1%＋1%
        longTermCare: {
            employee: 0.01,
            employer: 0.01,
        },
        // 労災：本人 0、会社だけ平均 0.3% くらいをざっくり
        workersComp: {
            employee: 0,
            employer: 0.003,
        },
    },
    residentTaxRate: 0.10,
    salaryIncomeDeductionTable: {
        brackets: [
            { maxSalary: 1625000, rule: { type: "flat", amount: 550000 } },
            { maxSalary: 1800000, rule: { type: "rateMinus", rate: 0.4, minus: 100000 } },
            { maxSalary: 3600000, rule: { type: "ratePlus", rate: 0.3, plus: 80000 } },
            { maxSalary: 6600000, rule: { type: "ratePlus", rate: 0.2, plus: 440000 } },
            { maxSalary: 8500000, rule: { type: "ratePlus", rate: 0.1, plus: 1100000 } },
            { maxSalary: null, rule: { type: "flat", amount: 1950000 } },
        ],
    },
    incomeTaxBrackets: [
        { maxTaxableIncome: 1950000, rate: 0.05, deduction: 0 },
        { maxTaxableIncome: 3300000, rate: 0.10, deduction: 97500 },
        { maxTaxableIncome: 6950000, rate: 0.20, deduction: 427500 },
        { maxTaxableIncome: 9000000, rate: 0.23, deduction: 636000 },
        { maxTaxableIncome: 18000000, rate: 0.33, deduction: 1536000 },
        { maxTaxableIncome: 40000000, rate: 0.40, deduction: 2796000 },
        { maxTaxableIncome: null, rate: 0.45, deduction: 4796000 },
    ],
    reconstructionTaxRate: 0.021,
};
