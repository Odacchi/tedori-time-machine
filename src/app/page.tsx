"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TaxInput } from "@/domain/tax/model";
import { calculateForPreset } from "@/domain/tax/calculator";
import { inputToSearchParams, searchParamsToInput } from "@/lib/urlParams";
import { TaxForm } from "@/components/tax/TaxForm";
import { TaxResultCard } from "@/components/tax/TaxResultCard";
import { DiffHighlightCard } from "@/components/tax/DiffHighlightCard";
import { GraphTabs } from "@/components/tax/GraphTabs";
import { ShareButtons } from "@/components/tax/ShareButtons";
import { GithubIcon } from "@/components/icons/GithubIcon";
import Link from "next/link";

function TedoriTimeMachine() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL or defaults
  const [input, setInput] = useState<TaxInput>(() => searchParamsToInput(searchParams));

  // Sync state to URL when input changes
  useEffect(() => {
    const params = inputToSearchParams(input);
    const queryString = params.toString();
    if (queryString !== searchParams.toString()) {
      router.replace(`${pathname}?${queryString}`, { scroll: false });
    }
  }, [input, pathname, router, searchParams]);

  // Calculate results
  const result1995 = useMemo(() => calculateForPreset(input, "1995"), [input]);
  const result2010 = useMemo(() => calculateForPreset(input, "2010"), [input]);
  const result2025 = useMemo(() => calculateForPreset(input, "2025"), [input]);
  const result2040 = useMemo(() => calculateForPreset(input, "2040"), [input]);

  // Diff metrics for highlight (1995 vs 2025, 2010 vs 2025, 2040 vs 2025/2040)
  const comparisons = useMemo(() => {
    const buildComparison = (
      base: ReturnType<typeof calculateForPreset>,
      label: string,
      baseYear: "1995" | "2010" | "2040"
    ) => {
      const isFuture = baseYear === "2040";

      // 1995/2010: base -> 2025
      // 2040: 2025 -> 2040（将来シナリオの落ち込みを見る）
      const baseData = isFuture ? result2025 : base;
      const currentData = isFuture ? result2040 : result2025;

      const diffNet = currentData.breakdown.netIncome - baseData.breakdown.netIncome;
      const grossRateBase = baseData.breakdown.netRateOnGross;
      const laborRateBase = baseData.breakdown.netRateOnLaborCost;

      return {
        baseYear,
        label: isFuture ? "2025年" : label,
        currentYearLabel: isFuture ? "2040年" : "2025年",
        baseNetIncome: baseData.breakdown.netIncome,
        currentNetIncome: currentData.breakdown.netIncome,
        baseLaborCost: baseData.breakdown.totalLaborCost,
        currentLaborCost: currentData.breakdown.totalLaborCost,
        diffNet,
        percentDownOnGross:
          grossRateBase > 0
            ? (currentData.breakdown.netRateOnGross / grossRateBase - 1) * 100
            : 0,
        percentDownOnLaborCost:
          laborRateBase > 0
            ? (currentData.breakdown.netRateOnLaborCost / laborRateBase - 1) * 100
            : 0,
        burdenDiff: {
          incomeTax: currentData.breakdown.incomeTax - baseData.breakdown.incomeTax,
          residentTax:
            currentData.breakdown.residentTax - baseData.breakdown.residentTax,
          social:
            currentData.breakdown.employeeSocialInsurance -
            baseData.breakdown.employeeSocialInsurance,
        },
      };
    };

    return [
      buildComparison(result1995, "1995年頃", "1995"),
      buildComparison(result2010, "2010年頃", "2010"),
      buildComparison(result2040, "2040年", "2040"),
    ];
  }, [result1995, result2010, result2025, result2040]);

  // Current URL for sharing
  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-[#f0f4ff] via-white to-[#fff0f5] shadow-xs isolate">
            {/* Background Effects */}
            <div
              className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none z-0"
              aria-hidden
            />
            <div
              className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl z-0"
              aria-hidden
            />
            <div
              className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-red-100/50 blur-3xl z-0"
              aria-hidden
            />

            <div className="relative z-10 px-6 py-10 md:px-12 md:py-14">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-between">

                {/* Left Content */}
                <div className="space-y-6 max-w-3xl flex-1">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/60 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 shadow-xs backdrop-blur-md">
                    <span className="font-bold text-slate-800 tracking-tight">手取りタイムマシン</span>
                    <span className="h-3 w-px bg-slate-300" />
                    <span>過去・現在・未来の手取り比較</span>
                    <span className="ml-1 inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Beta
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                    同じ年収でも、
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                      過去・現在・未来
                    </span>
                    で手取りはどれだけ変わる？
                  </h1>

                  {/* Description */}
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                    年少扶養控除の廃止や社会保険料率の上昇などで、手取りは大きく変化してきました。
                    <br className="hidden md:block" />
                    手取りタイムマシンでは、額面年収を入れるだけで「手取り額」と「税金・社会保険料などの内訳」を、
                    <span className="font-semibold text-slate-800">1995年・2010年・2025年・2040年</span>
                    の4つの時点で一瞬で比較できます。
                  </p>

                  {/* こだわり比較モードへのさりげない導線 */}
                  <p className="text-xs text-slate-500 mt-1">
                    条件を変えたパターン同士も比べてみたい方は、
                    {" "}
                    <Link
                      href="/compare"
                      className="underline underline-offset-2 decoration-dotted hover:text-slate-700"
                    >
                      こだわり比較モード（最大4パターン比較）
                    </Link>
                    {" "}
                    もお試しください。
                  </p>

                  {/* CTA Buttons */}
                  <div className="pt-2 hidden sm:block">
                    <ShareButtons
                      result1995={result1995}
                      result2025={result2025}
                      variant="hero"
                      className="origin-left scale-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Input + Highlight Section */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <TaxForm value={input} onChange={setInput} />
          </div>
          <DiffHighlightCard
            comparisons={comparisons}
            currentUrl={currentUrl}
            isSalaryZero={input.annualSalary <= 0}
            input={input}
          />
        </section>

        {/* Comparison Cards Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">詳細比較</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <TaxResultCard result={result1995} title="1995年頃" />
            <TaxResultCard result={result2010} title="2010年頃" />
            <TaxResultCard result={result2025} title="現在の制度（2025年頃）" />
            <TaxResultCard result={result2040} title="2040年（将来シナリオ）" />
          </div>
        </section>

        {/* Charts Section */}
        <section className="space-y-8">
          <GraphTabs
            input={input}
            rates1995={{
              gross: result1995.breakdown.netRateOnGross,
              labor: result1995.breakdown.netRateOnLaborCost,
            }}
            rates2010={{
              gross: result2010.breakdown.netRateOnGross,
              labor: result2010.breakdown.netRateOnLaborCost,
            }}
            rates2025={{
              gross: result2025.breakdown.netRateOnGross,
              labor: result2025.breakdown.netRateOnLaborCost,
            }}
            rates2040={{
              gross: result2040.breakdown.netRateOnGross,
              labor: result2040.breakdown.netRateOnLaborCost,
            }}
            laborCost1995={{
              net: result1995.breakdown.netIncome,
              incomeTax: result1995.breakdown.incomeTax,
              residentTax: result1995.breakdown.residentTax,
              employeeSocial: result1995.breakdown.employeeSocialInsurance,
              employerSocial: result1995.breakdown.employerSocialInsurance,
            }}
            laborCost2010={{
              net: result2010.breakdown.netIncome,
              incomeTax: result2010.breakdown.incomeTax,
              residentTax: result2010.breakdown.residentTax,
              employeeSocial: result2010.breakdown.employeeSocialInsurance,
              employerSocial: result2010.breakdown.employerSocialInsurance,
            }}
            laborCost2025={{
              net: result2025.breakdown.netIncome,
              incomeTax: result2025.breakdown.incomeTax,
              residentTax: result2025.breakdown.residentTax,
              employeeSocial: result2025.breakdown.employeeSocialInsurance,
              employerSocial: result2025.breakdown.employerSocialInsurance,
            }}
            laborCost2040={{
              net: result2040.breakdown.netIncome,
              incomeTax: result2040.breakdown.incomeTax,
              residentTax: result2040.breakdown.residentTax,
              employeeSocial: result2040.breakdown.employeeSocialInsurance,
              employerSocial: result2040.breakdown.employerSocialInsurance,
            }}
          />
        </section>

        {/* Share Section */}
        <section className="max-w-md mx-auto pt-8 text-center space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800">手取りタイムマシンをシェア</h2>
            <p className="text-sm text-muted-foreground">
              面白い／役に立つと思ったら、ぜひSNSで紹介してください👐
            </p>
          </div>
          <ShareButtons result1995={result1995} result2025={result2025} />
        </section>

        {/* About Tool */}
        <section className="border rounded-lg p-6 bg-muted/30 space-y-3">
          <h2 className="text-lg font-semibold">このツールについて</h2>
          <p className="text-sm text-muted-foreground">
            「手取りタイムマシン」は、社会保険料や税制の変化による“手取りの目減り”を可視化するために個人で開発したものです。
            住む地域による住民税の差は小さいため、本ツールでは全国一律でモデル化しています。
          </p>
          <p className="text-sm text-muted-foreground">
            1995年・2010年・2025年は、当時の税制・社会保険料率を参考にした簡易モデルに基づいて計算しています。
            2040年は、現在の傾向を踏まえた仮の「将来シナリオ」として設定したものであり、実際の制度を予測・保証するものではありません。
          </p>
          <p className="text-sm text-muted-foreground">
            ご意見・バグ報告などは GitHub の Issue/PR でお願いします（
            <a
              href="https://github.com/Odacchi/tedori-time-machine"
              className="inline-flex items-center gap-1 underline decoration-dotted font-medium"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon className="w-4 h-4" aria-hidden="true" />
              <span>GitHubリポジトリ</span>
            </a>
            <a
              href="https://x.com/is_odacchi"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              @is_odacchi
            </a>
            ）でも発信していますが、正式な窓口は GitHub が確実です。
          </p>
          <div className="pt-2 border-t border-slate-200/60 mt-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-bold text-slate-500">研究用・検証用機能：</span>
              <Link href="/compare" className="underline hover:text-slate-800 ml-1">
                手取りシミュレーション比較（複数シナリオ比較）
              </Link>
            </p>
          </div>
        </section>

        {/* Footer Disclaimer */}
        <footer className="text-xs text-muted-foreground text-center pt-10 pb-4 border-t mt-10">
          <p>
            ※このツールの結果は簡易的な概算です。実際の税額・社会保険料とは異なる場合があります。
            <br />
            税務上の判断が必要な場合は、税理士などの専門家にご相談ください。
          </p>
          <p className="mt-3">
            ※本ツールは、1995年・2010年・2025年の税制・社会保険料率を参考にしたモデルと、
            現在の傾向を踏まえた2040年の将来シナリオに基づいて計算しています。
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <TedoriTimeMachine />
    </Suspense>
  );
}