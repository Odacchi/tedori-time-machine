import { TaxRuleSet } from "../model";
import { rules2025 } from "./2025";

/**
 * 2040年シナリオの前提:
 * - 社会保障給付費は 2025年の約140兆円 → 2040年の約190兆円（+50兆円）
 * - 2025年時点での社会保険料収入はざっくり 80兆円規模とみなす
 * - 増加分50兆円をすべて社会保険料で賄う極端シナリオ
 * - 生産年齢人口は20%減るが、AI活用等の生産性向上により賃金総額（保険料をかける母数）は維持されると仮定
 *
 * → 社会保険料収入は 80兆円 → 130兆円 で約1.6倍必要になる。
 *   そのため、年金・健康・介護の保険料率を2025年比で一律1.6倍する。
 */
const SOCIAL_INSURANCE_FACTOR_2040 = 1.6;

export const rules2040: TaxRuleSet = {
    ...rules2025,
    socialInsurance: {
        pension: {
            employee: rules2025.socialInsurance.pension.employee * SOCIAL_INSURANCE_FACTOR_2040,
            employer: rules2025.socialInsurance.pension.employer * SOCIAL_INSURANCE_FACTOR_2040,
        },
        health: {
            employee: rules2025.socialInsurance.health.employee * SOCIAL_INSURANCE_FACTOR_2040,
            employer: rules2025.socialInsurance.health.employer * SOCIAL_INSURANCE_FACTOR_2040,
        },
        unemployment: { ...rules2025.socialInsurance.unemployment },
        longTermCare: {
            employee: rules2025.socialInsurance.longTermCare.employee * SOCIAL_INSURANCE_FACTOR_2040,
            employer: rules2025.socialInsurance.longTermCare.employer * SOCIAL_INSURANCE_FACTOR_2040,
        },
        workersComp: { ...rules2025.socialInsurance.workersComp },
    },
}
