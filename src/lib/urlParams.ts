import { TaxInput } from "../domain/tax/model";

export function inputToSearchParams(input: TaxInput): URLSearchParams {
    const params = new URLSearchParams();

    // Salary in Man-yen
    params.set("y", (input.annualSalary / 10000).toString());

    // Spouse
    params.set("sp", input.spouse === "dependent" ? "d" : "n");

    // Children
    if (input.children.under16 > 0) params.set("c0", input.children.under16.toString());
    if (input.children.age16to18 > 0) params.set("c1", input.children.age16to18.toString());
    if (input.children.age19to23 > 0) params.set("c2", input.children.age19to23.toString());

    // Age 40+
    if (input.isOver40) params.set("a40", "1");

    return params;
}

export function searchParamsToInput(params: URLSearchParams): TaxInput {
    const y = parseInt(params.get("y") || "500", 10);
    const sp = params.get("sp");
    const c0 = parseInt(params.get("c0") || "0", 10);
    const c1 = parseInt(params.get("c1") || "0", 10);
    const c2 = parseInt(params.get("c2") || "0", 10);
    const a40 = params.get("a40") === "1";

    return {
        annualSalary: (isNaN(y) ? 500 : y) * 10000,
        spouse: sp === "d" ? "dependent" : "none",
        children: {
            under16: isNaN(c0) ? 0 : c0,
            age16to18: isNaN(c1) ? 0 : c1,
            age19to23: isNaN(c2) ? 0 : c2,
        },
        isOver40: a40,
    };
}
