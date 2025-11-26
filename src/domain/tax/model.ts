export type TaxYearPreset = "1995" | "2010" | "2025";

export type TaxInput = {
    annualSalary: number; // gross salary in yen (e.g. 5000000)
    isOver40: boolean; // whether the person is 40+ (for long-term care insurance)
    spouse: "none" | "dependent"; // whether spouse deduction applies
    children: {
        under16: number;
        age16to18: number;
        age19to23: number;
    };
};

export type TaxBreakdown = {
    incomeTax: number;
    residentTax: number;
    employeeSocialInsurance: number; // personal share
    employerSocialInsurance: number; // company share
    totalLaborCost: number; // salary + employerSocialInsurance
    netIncome: number; // take-home pay
    netRateOnGross: number; // netIncome / annualSalary
    netRateOnLaborCost: number; // netIncome / totalLaborCost
};

export type SalaryIncomeDeductionRule =
    | { type: "flat"; amount: number }
    | { type: "rateMinus"; rate: number; minus: number }
    | { type: "ratePlus"; rate: number; plus: number };

export type SalaryIncomeDeductionBracket = {
    maxSalary: number | null; // inclusive upper bound; null means no upper bound
    rule: SalaryIncomeDeductionRule;
};

export type SalaryIncomeDeductionTable = {
    brackets: SalaryIncomeDeductionBracket[];
};

export type IncomeTaxBracket = {
    maxTaxableIncome: number | null; // inclusive upper bound; null means no upper bound
    rate: number; // e.g. 0.05 = 5%
    deduction: number; // quick deduction amount
};

export type TaxRuleSet = {
    basicDeduction: number;
    spouseDeduction: number;
    // Optional income threshold for spouse deduction (e.g., 2025 reform removes deduction over 10M)
    spouseDeductionIncomeLimit?: number;
    childDeductions: {
        under16: number;
        age16to18: number;
        age19to23: number;
    };
    socialInsuranceRate: number; // Employee share (Health + Pension + Employment)
    employerSocialRate: number; // Employer share
    longTermCareRate: number; // Extra rate for 40+
    hasLongTermCare: boolean; // Whether LTC exists in this year
    residentTaxRate: number; // 0.10
    salaryIncomeDeductionTable: SalaryIncomeDeductionTable;
    incomeTaxBrackets: IncomeTaxBracket[];
    reconstructionTaxRate: number; // e.g. 0.021 for applicable years, 0 otherwise
};

export type TaxResult = {
    yearPreset: TaxYearPreset;
    breakdown: TaxBreakdown;
};
