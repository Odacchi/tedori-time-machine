# Tedori Time Machine
1995年・2010年・2025年の“手取り感”をざっくり比較できる、日本の給与シミュレーター

## Short English summary
Tedori Time Machine is a Japanese income tax and social insurance simulator. It compares approximate take-home pay for 1995, 2010, and 2025 given the same gross salary and family conditions. The model is intentionally simplified and for educational purposes only, not a legally accurate tax calculator. Contributions and refinements to the tax rules are welcome.

## 概要
日本の給与所得者が、税金・社会保険料・手取りをざっくり比較できるツールです。1995年・2010年・2025年の3つの年をプリセットとして、同じ年収・世帯構成で「制度の変化によって取り分がどれくらい変わったか」を直感的に感じてもらうことを目的としています。厳密な税額計算ではなく、「感覚をつかむためのシミュレーション」である点にご注意ください。

## 特徴
- 年収、配偶者の有無、子どもの人数（年齢帯別）、40歳以上かどうかを入力して比較
- 1995 / 2010 / 2025 の税制・社会保険制度の違いを共通ロジックでざっくり比較
- 額面年収・会社負担を含めた総労働コスト・手取り・実質負担率などを算出
- `TaxRuleSet` で各年のルールを定義し、`rules/1995.ts` `rules/2010.ts` `rules/2025.ts` から追えるシンプルな設計

## 税制ロジックの概要 (How the tax model works)
- 型の役割: `TaxInput` は入力パラメータ、`TaxResult` は結果、`TaxBreakdown` は税・社保内訳。`TaxRuleSet` が各年のルール（基礎控除、配偶者控除、扶養控除、社会保険料率、住民税率、給与所得控除テーブル、所得税率表、復興特別所得税率など）をまとめています。
- 年ごとのルールは `src/domain/tax/rules/1995.ts` `src/domain/tax/rules/2010.ts` `src/domain/tax/rules/2025.ts` に定義。
- `src/domain/tax/calculator.ts` で以下の順序で計算:
  1. 社会保険料（本人・会社）を年収 × 料率で概算
  2. `salaryIncomeDeductionTable` から給与所得控除額を決定
  3. 給与所得 − 所得控除（基礎控除・社会保険料控除・配偶者控除・扶養控除など）＝ 課税所得
  4. 課税所得に `incomeTaxBrackets` の累進税率を適用し、`reconstructionTaxRate` を乗じて所得税を計算
  5. 住民税は「課税所得 × 一律住民税率」で概算
  6. 所得税 + 住民税 + 社会保険料（本人負担）を差し引いて手取りを算出
  7. 会社負担分の社会保険料を含めて総労働コストを計算

## 前提・簡略化している点 (Assumptions & Limitations)
- 実際の税制・社会保険制度は極めて複雑で、多くをざっくり近似しています。
- 例: 標準報酬月額や賞与の上限・等級を無視し、年収 × 一定率で社会保険料を計算。
- 給与所得控除・所得控除・扶養控除は当時の制度を簡略化したテーブルを使用。
- 住民税は「一律10%」等の単純モデルで、均等割・調整控除などは未考慮。
- 児童手当など税制以外の給付は考慮していません。
- そのため年末調整や確定申告の実額とは一致しません。法的アドバイスではなく、正確な金額が必要な場合は税理士や公式情報を参照してください。

## 対象ユーザー (Who is this for?)
- 税金・社会保険の変化をざっくり知りたい人
- 自分や家族の手取り感が昔と比べてどれくらい変わったかをイメージしたい人
- 授業や勉強会で制度の変化を紹介するための簡易教材がほしい人

## セットアップ & 実行方法 (Getting Started)
- 前提: Node.js 18 以上推奨。Next.js + React ベースのフロントエンドです。
- 依存関係のインストール: `npm install`
- 開発サーバー: `npm run dev`（http://localhost:3000 をブラウザで開く）
- ビルド: `npm run build`
- 本番モード起動: `npm run start`
- Lint: `npm run lint`
- ドメインモデルのテスト: `npm run test:domain`（税計算ロジックのみを Node.js built-in test で実行）

## ディレクトリ構成の一例 (Project structure)
```
src/
  app/                 # Next.js App Router エントリ
  components/
    tax/               # 表示コンポーネント（例: TaxResultCard）
  domain/
    tax/
      model.ts         # 型定義 (TaxInput, TaxResult, TaxRuleSet など)
      calculator.ts    # 税・社保計算ロジック
      rules/
        1995.ts        # 1995年の概算ルール
        2010.ts        # 2010年の概算ルール
        2025.ts        # 2025年の概算ルール
  lib/                 # ユーティリティ
```

## コントリビュート方法 (Contributing)
- Issue / Pull Request 歓迎です。大きな変更はまず Issue で相談してください。
- とくに「1995年・2010年当時の正確な税率・控除テーブル」に詳しい方からの情報・PRを大歓迎します。
- バグ修正や改善の提案もお気軽に。
- 連絡・議論は GitHub の Issue/PR でお願いします（リポジトリ: https://github.com/Odacchi/tedori-time-machine ）。X は通知が流れやすいため、正式な窓口は GitHub で。

## ライセンス (License)
- MIT License（`LICENSE` を参照）。
