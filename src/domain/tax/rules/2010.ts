import { TaxRuleSet } from "../model";

// NOTE: Approximate values for ~2010
export const rules2010: TaxRuleSet = {
    basicDeduction: 380000,
    spouseDeduction: 380000,
    childDeductions: {
        under16: 380000, // 年少扶養控除あり
        age16to18: 630000, // 特定扶養親族 (16-22 was wider then, simplified to 16-18 high deduction)
        age19to23: 630000, // 特定扶養親族
    },
    socialInsuranceRate: 0.135, // Approx 13.5%
    employerSocialRate: 0.135, // Assume equal split
    longTermCareRate: 0.012, // Approx 1.2% (started 2000)
    hasLongTermCare: true,
    residentTaxRate: 0.10,
    salaryIncomeDeductionTable: {
        brackets: [
            { maxSalary: 1625000, rule: { type: "flat", amount: 550000 } },
        { maxSalary: 1800000, rule: { type: "rateMinus", rate: 0.4, minus: 100000 } },
        { maxSalary: 3600000, rule: { type: "ratePlus", rate: 0.3, plus: 80000 } },
        { maxSalary: 6600000, rule: { type: "ratePlus", rate: 0.2, plus: 440000 } },
        { maxSalary: 8500000, rule: { type: "ratePlus", rate: 0.1, plus: 1100000 } },
        { maxSalary: null, rule: { type: "flat", amount: 2450000 } }, // 当時の上限は約245万円
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
