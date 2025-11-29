/** 比較対象となる税制年のプリセット識別子 */
export type TaxYearPreset = "1995" | "2010" | "2025" | "2040";

/** 入力として受け取る給与所得者の属性 */
export type TaxInput = {
    /** 額面年収（円）。例: 5_000_000 */
    annualSalary: number;
    /** 40歳以上なら true（介護保険料を計算に含めるため） */
    isOver40: boolean;
    /** 配偶者控除が適用されるかどうか */
    spouse: "none" | "dependent";
    /** 扶養子どもの人数（年齢帯別） */
    children: {
        /** 0〜15歳の人数 */
        under16: number;
        /** 16〜18歳の人数 */
        age16to18: number;
        /** 19〜23歳の人数 */
        age19to23: number;
    };
};

/** 計算結果の内訳（税・社保と手取りのまとめ） */
export type TaxBreakdown = {
    /** 所得税額（復興特別所得税を含む場合あり） */
    incomeTax: number;
    /** 住民税額 */
    residentTax: number;
    /** 本人負担の社会保険料合計 */
    employeeSocialInsurance: number;
    /** 会社負担の社会保険料合計 */
    employerSocialInsurance: number;
    /** 総労働コスト（年収＋会社負担社保） */
    totalLaborCost: number;
    /** 手取り額（年収 − 税・本人社保） */
    netIncome: number;
    /** 額面年収に対する手取り率 */
    netRateOnGross: number;
    /** 総労働コストに対する手取り率 */
    netRateOnLaborCost: number;
};

/** 社会保険の 1 制度あたり（本人 / 会社）の負担率 */
export type SocialInsuranceRatePart = {
    /** 本人負担（給与に対する割合） */
    employee: number;
    /** 会社負担 */
    employer: number;
};

/** 社会保険の内訳（会社員版） */
export type SocialInsuranceRates = {
    /** 厚生年金 */
    pension: SocialInsuranceRatePart;
    /** 健康保険（協会けんぽ等） */
    health: SocialInsuranceRatePart;
    /** 雇用保険 */
    unemployment: SocialInsuranceRatePart;
    /** 介護保険（40〜64歳） */
    longTermCare: SocialInsuranceRatePart;
    /** 労災保険（社員負担 0 が前提） */
    workersComp: SocialInsuranceRatePart;
};

/** 給与所得控除の計算ルール */
export type SalaryIncomeDeductionRule =
    | { type: "flat"; amount: number }
    | { type: "rateMinus"; rate: number; minus: number }
    | { type: "ratePlus"; rate: number; plus: number };

/** 給与所得控除テーブルの1段（年収上限と計算式） */
export type SalaryIncomeDeductionBracket = {
    /** この段の上限年収（含む）。nullなら上限なし */
    maxSalary: number | null;
    /** 該当する給与所得控除の計算ルール */
    rule: SalaryIncomeDeductionRule;
};

/** 給与所得控除テーブル（段階別の控除計算） */
export type SalaryIncomeDeductionTable = {
    /** ブラケットを上から順に評価する配列 */
    brackets: SalaryIncomeDeductionBracket[];
};

/** 所得税の速算表の1段（課税所得の上限、税率、控除額） */
export type IncomeTaxBracket = {
    /** この段の課税所得上限（含む）。nullなら上限なし */
    maxTaxableIncome: number | null;
    /** 税率（例: 0.05 は5%） */
    rate: number;
    /** 速算控除額（quick deduction） */
    deduction: number;
};

/** ある年の税・社会保険ルール一式 */
export type TaxRuleSet = {
    /** 基礎控除額 */
    basicDeduction: number;
    /** 配偶者控除額 */
    spouseDeduction: number;
    /** 配偶者控除の適用上限となる給与所得 */
    spouseDeductionIncomeLimit: number;
    /** 扶養控除額のテーブル（年齢帯別） */
    childDeductions: {
        /** 0〜15歳の控除額 */
        under16: number;
        /** 16〜18歳の控除額 */
        age16to18: number;
        /** 19〜23歳の控除額 */
        age19to23: number;
    };
    /** 社会保険料率の内訳 */
    socialInsurance: SocialInsuranceRates;
    /** 住民税の一律率（例: 0.10） */
    residentTaxRate: number;
    /** 給与所得控除テーブル */
    salaryIncomeDeductionTable: SalaryIncomeDeductionTable;
    /** 所得税の速算表 */
    incomeTaxBrackets: IncomeTaxBracket[];
    /** 復興特別所得税率（該当年のみ乗算） */
    reconstructionTaxRate: number;
};

/** 出力する結果（どの年の計算かと内訳） */
export type TaxResult = {
    /** 計算に使った年プリセット */
    yearPreset: TaxYearPreset;
    /** 税・社保・手取りの内訳 */
    breakdown: TaxBreakdown;
};
