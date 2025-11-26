import type { TaxInput } from "./model";

export type PresetId =
  | "single_no_children"
  | "single_income_2kids"
  | "dual_income_2kids"
  | "dual_income_4kids";

export type PresetScenario = {
  id: PresetId;
  label: string;
  description?: string;
  input: TaxInput;
};

// 年収は円ベース。コメントは万円目安。
export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "single_no_children",
    label: "独身・子どもなし",
    input: {
      annualSalary: 5_000_000, // 500万円
      isOver40: true,
      spouse: "none",
      children: { under16: 0, age16to18: 0, age19to23: 0 },
    },
  },
  {
    id: "single_income_2kids",
    label: "片働き・子ども2人（0〜15歳）",
    input: {
      annualSalary: 6_000_000, // 600万円
      isOver40: true,
      spouse: "dependent",
      children: { under16: 2, age16to18: 0, age19to23: 0 },
    },
  },
  {
    id: "dual_income_2kids",
    label: "共働き・子ども2人（0〜15歳）",
    input: {
      annualSalary: 6_000_000, // 600万円
      isOver40: true,
      spouse: "none", // 共働き → 配偶者控除なし
      children: { under16: 2, age16to18: 0, age19to23: 0 },
    },
  },
  {
    id: "dual_income_4kids",
    label: "共働き・子ども4人（0〜15歳／多子世帯）",
    input: {
      annualSalary: 6_500_000, // 650万円
      isOver40: true,
      spouse: "none",
      children: { under16: 4, age16to18: 0, age19to23: 0 },
    },
  },
];
