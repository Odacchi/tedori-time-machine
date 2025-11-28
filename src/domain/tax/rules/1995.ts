import { TaxRuleSet } from "../model";

// NOTE: Approximate values for ~1995
export const rules1995: TaxRuleSet = {
    basicDeduction: 380000,
    spouseDeduction: 380000,
    spouseDeductionIncomeLimit: Number.POSITIVE_INFINITY,
    childDeductions: {
        under16: 380000, // Generous deductions
        age16to18: 530000, // Specific dependent
        age19to23: 530000, // Specific dependent
    },
    socialInsurance: {
        pension: { employee: 0.07, employer: 0.07 },
        health: { employee: 0.035, employer: 0.035 },
        unemployment: { employee: 0.01, employer: 0.01 },
        longTermCare: { employee: 0, employer: 0 }, // No LTC yet
        workersComp: { employee: 0, employer: 0 },
    },
    residentTaxRate: 0.10, // Simplified
    salaryIncomeDeductionTable: {
        brackets: [
            { maxSalary: 1625000, rule: { type: "flat", amount: 550000 } },
        { maxSalary: 1800000, rule: { type: "rateMinus", rate: 0.4, minus: 100000 } },
        { maxSalary: 3600000, rule: { type: "ratePlus", rate: 0.3, plus: 80000 } },
        { maxSalary: 6600000, rule: { type: "ratePlus", rate: 0.2, plus: 440000 } },
        { maxSalary: 8500000, rule: { type: "ratePlus", rate: 0.1, plus: 1100000 } },
        { maxSalary: null, rule: { type: "flat", amount: 2450000 } }, // 90年代半ばは上限245万円程度
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
    reconstructionTaxRate: 0,
};
