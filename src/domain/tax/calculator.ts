import { TaxInput, TaxResult, TaxYearPreset, TaxRuleSet } from "./model";
import { rules1995 } from "./rules/1995";
import { rules2010 } from "./rules/2010";
import { rules2025 } from "./rules/2025";

function getSalaryIncomeDeduction(salary: number, rules: TaxRuleSet): number {
    const table = rules.salaryIncomeDeductionTable;
    const bracket = table.brackets.find((b) =>
        b.maxSalary === null ? true : salary <= b.maxSalary
    );

    if (!bracket) return 0;

    const rule = bracket.rule;
    let deduction = 0;

    switch (rule.type) {
        case "flat":
            deduction = rule.amount;
            break;
        case "rateMinus":
            deduction = salary * rule.rate - rule.minus;
            break;
        case "ratePlus":
            deduction = salary * rule.rate + rule.plus;
            break;
    }

    return Math.min(salary, deduction);
}

function getIncomeTax(taxableIncome: number, rules: TaxRuleSet): number {
    if (taxableIncome <= 0) return 0;

    const bracket = rules.incomeTaxBrackets.find((b) =>
        b.maxTaxableIncome === null ? true : taxableIncome <= b.maxTaxableIncome
    );

    if (!bracket) return 0;

    const baseTax = taxableIncome * bracket.rate - bracket.deduction;
    const reconstructionRate = rules.reconstructionTaxRate ?? 0;

    return baseTax * (1 + reconstructionRate);
}

export function calculateForPreset(input: TaxInput, preset: TaxYearPreset): TaxResult {
    let rules: TaxRuleSet;
    switch (preset) {
        case "1995": rules = rules1995; break;
        case "2010": rules = rules2010; break;
        case "2025": rules = rules2025; break;
    }

    const { annualSalary } = input;

    // 1. Social Insurance (sum of each scheme; LTC applies only if 40+)
    const baseEmployeeSocialRate =
        rules.socialInsurance.pension.employee +
        rules.socialInsurance.health.employee +
        rules.socialInsurance.unemployment.employee;

    const baseEmployerSocialRate =
        rules.socialInsurance.pension.employer +
        rules.socialInsurance.health.employer +
        rules.socialInsurance.unemployment.employer +
        rules.socialInsurance.workersComp.employer;

    const includeLTC = input.isOver40;
    const employeeSocialRate =
        baseEmployeeSocialRate + (includeLTC ? rules.socialInsurance.longTermCare.employee : 0);
    const employerSocialRate =
        baseEmployerSocialRate + (includeLTC ? rules.socialInsurance.longTermCare.employer : 0);

    const employeeSocialInsurance = annualSalary * employeeSocialRate;
    const employerSocialInsurance = annualSalary * employerSocialRate;

    // 2. Salary Income
    // Ensure deduction doesn't exceed salary
    const deduction = getSalaryIncomeDeduction(annualSalary, rules);
    const salaryIncome = annualSalary - deduction;

    // 3. Deductions
    let totalDeductions = rules.basicDeduction + employeeSocialInsurance;

    const isSpouseDeductible =
        input.spouse === "dependent" && salaryIncome <= rules.spouseDeductionIncomeLimit;

    if (isSpouseDeductible) {
        totalDeductions += rules.spouseDeduction;
    }

    totalDeductions += input.children.under16 * rules.childDeductions.under16;
    totalDeductions += input.children.age16to18 * rules.childDeductions.age16to18;
    totalDeductions += input.children.age19to23 * rules.childDeductions.age19to23;

    // 4. Taxable Income
    const taxableIncome = Math.max(0, salaryIncome - totalDeductions);

    // 5. Income Tax
    const incomeTax = getIncomeTax(taxableIncome, rules);

    // 6. Resident Tax
    // Simplified: 10% of taxable income (roughly)
    const residentTax = taxableIncome * rules.residentTaxRate;

    // 7. Total Burden & Net Income
    const totalBurden = incomeTax + residentTax + employeeSocialInsurance;
    const netIncome = annualSalary - totalBurden;

    // 8. Labor Cost Metrics
    const totalLaborCost = annualSalary + employerSocialInsurance;
    const netRateOnGross = annualSalary > 0 ? netIncome / annualSalary : 0;
    const netRateOnLaborCost = totalLaborCost > 0 ? netIncome / totalLaborCost : 0;

    return {
        yearPreset: preset,
        breakdown: {
            incomeTax: Math.floor(incomeTax),
            residentTax: Math.floor(residentTax),
            employeeSocialInsurance: Math.floor(employeeSocialInsurance),
            employerSocialInsurance: Math.floor(employerSocialInsurance),
            totalLaborCost: Math.floor(totalLaborCost),
            netIncome: Math.floor(netIncome),
            netRateOnGross,
            netRateOnLaborCost,
        },
    };
}
