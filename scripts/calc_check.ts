
import { calculateForPreset } from "../src/domain/tax/calculator";

const baseInput = {
    isOver40: true,
    spouse: "none" as const,
    children: { under16: 0, age16to18: 0, age19to23: 0 },
};

console.log("--- 11.9M, No Spouse ---");
console.log(calculateForPreset({ ...baseInput, annualSalary: 11_900_000 }, "2025").breakdown);

console.log("--- 12.0M, No Spouse ---");
console.log(calculateForPreset({ ...baseInput, annualSalary: 12_000_000 }, "2025").breakdown);
