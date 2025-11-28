import { TaxRuleSet } from "../model";

// NOTE: Approximate values for ~1995
export const rules1995: TaxRuleSet = {
    basicDeduction: 380000,
    spouseDeduction: 380000,
    spouseDeductionIncomeLimit: Number.POSITIVE_INFINITY,
    childDeductions: {
        under16: 380000, // Generous deductions
        age16to18: 530000, // Specific dependentï
        age19to23: 530000, // Specific dependent
    },
    socialInsurance: {
        // 厚生年金 ≒13.5%
        pension: { 
            employee: 0.0675,
            employer: 0.0675,
        },  
        // 政管健保≒協会けんぽ相当 ≒8.2%    
        health: { 
            employee: 0.041, 
            employer: 0.041, 
        }, 
        // 雇用保険：会社の方が高い想定
        unemployment: { 
            employee: 0.005, 
            employer: 0.008,
        },
        // 介護保険なし
        longTermCare: { 
            employee: 0, 
            employer: 0 
        },
        // 労災：本人 0, 会社のみざっくり
        workersComp: { 
            employee: 0, 
            employer: 0.003 
        },
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
