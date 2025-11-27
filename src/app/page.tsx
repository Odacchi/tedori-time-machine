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

  // Diff metrics for highlight (1995 vs 2025, 2010 vs 2025)
  const comparisons = useMemo(() => {
    const buildComparison = (
      base: ReturnType<typeof calculateForPreset>,
      label: string,
      baseYear: "1995" | "2010"
    ) => {
      const diffNet = result2025.breakdown.netIncome - base.breakdown.netIncome;
      const grossRateBase = base.breakdown.netRateOnGross;
      const laborRateBase = base.breakdown.netRateOnLaborCost;
      return {
        baseYear,
        label,
        baseNetIncome: base.breakdown.netIncome,
        currentNetIncome: result2025.breakdown.netIncome,
        baseLaborCost: base.breakdown.totalLaborCost,
        currentLaborCost: result2025.breakdown.totalLaborCost,
        diffNet,
        percentDownOnGross: grossRateBase > 0 ? (result2025.breakdown.netRateOnGross / grossRateBase - 1) * 100 : 0,
        percentDownOnLaborCost: laborRateBase > 0 ? (result2025.breakdown.netRateOnLaborCost / laborRateBase - 1) * 100 : 0,
        burdenDiff: {
          incomeTax: result2025.breakdown.incomeTax - base.breakdown.incomeTax,
          residentTax: result2025.breakdown.residentTax - base.breakdown.residentTax,
          social: result2025.breakdown.employeeSocialInsurance - base.breakdown.employeeSocialInsurance,
        },
      };
    };

    return [
      buildComparison(result1995, "1995年頃", "1995"),
      buildComparison(result2010, "2010年頃", "2010"),
    ];
  }, [result1995, result2010, result2025]);

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
          <div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-[#dfe8ff] via-white to-[#ffe5ec] px-6 md:px-10 py-6 shadow-sm isolate">
            <div className="absolute inset-0 bg-white/60 pointer-events-none z-0" aria-hidden />
            <div className="absolute -left-16 -top-12 h-52 w-52 rounded-full bg-[#cde3ff] opacity-35 blur-xl z-0" aria-hidden />
            <div className="absolute -bottom-24 right-6 h-64 w-64 rounded-full bg-[#ffd6dc] opacity-35 blur-2xl z-0" aria-hidden />

            <div className="max-w-6xl mx-auto space-y-6 relative z-10">
              {/* 肩書きラベル */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
                <span>手取りタイムマシン</span>
                <span className="h-3 w-px bg-emerald-200" />
                <span>1995 / 2010 / 2025 比較シミュレーター</span>
                <span className="ml-1 inline-flex items-center rounded-full border border-slate-300 bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-800">
                  BETA
                </span>
              </div>

              <div className="space-y-4 text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight max-w-4xl">
                  同じ年収でも、時代で
                  <br className="hidden md:block" />
                  手取りはどれだけ変わる？
                </h1>

                <p className="text-muted-foreground leading-relaxed text-base md:text-lg max-w-5xl">
                  年少扶養控除の廃止や社会保険料率の上昇などで、1995・2010・2025の手取りは大きく変化しています。
                  会社が負担する社会保険料を含めた「人件費」のうち、どれだけが手取りになるのかも一目で比較できます。
                </p>

                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 border text-emerald-800">
                      介護保険料や扶養控除の変化をざっくり反映
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 border text-amber-800">
                      所得税・住民税・社会保険の簡易モデル
                    </span>
                  </div>

                  {/* Desktop Share Buttons */}
                  <div className="hidden md:block">
                    <ShareButtons
                      result1995={result1995}
                      result2025={result2025}
                      variant="hero"
                      className="scale-90 origin-right"
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
          <div className="grid gap-6 md:grid-cols-3">
            <TaxResultCard result={result1995} title="1995年頃" />
            <TaxResultCard result={result2010} title="2010年頃" />
            <TaxResultCard result={result2025} title="現在の制度（2025年頃）" />
          </div>
        </section>

        {/* Charts Section */}
        <section className="space-y-8">
          <GraphTabs
            input={input}
            rates1995={{ gross: result1995.breakdown.netRateOnGross, labor: result1995.breakdown.netRateOnLaborCost }}
            rates2010={{ gross: result2010.breakdown.netRateOnGross, labor: result2010.breakdown.netRateOnLaborCost }}
            rates2025={{ gross: result2025.breakdown.netRateOnGross, labor: result2025.breakdown.netRateOnLaborCost }}
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
          <ShareButtons
            result1995={result1995}
            result2025={result2025}
          />
        </section>

        {/* About Tool */}
        <section className="border rounded-lg p-6 bg-muted/30 space-y-3">
          <h2 className="text-lg font-semibold">このツールについて</h2>
          <p className="text-sm text-muted-foreground">
            「手取りタイムマシン」は、社会保険料や税制の変化による“手取りの目減り”を可視化するために個人で開発したものです。
            住む地域による住民税の差は小さいため、本ツールでは全国一律でモデル化しています。
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
            ）。開発者は X（
            <a href="https://x.com/is_odacchi" className="underline" target="_blank" rel="noreferrer">@is_odacchi</a>
            ）でも発信していますが、正式な窓口は GitHub が確実です。
          </p>
        </section>

        {/* Footer Disclaimer */}
        <footer className="text-xs text-muted-foreground text-center pt-10 pb-4 border-t mt-10">
          <p>
            ※このツールの結果は簡易的な概算です。実際の税額・社会保険料とは異なる場合があります。
            <br />
            税務上の判断が必要な場合は、税理士などの専門家にご相談ください。
          </p>
          <p className="mt-3">
            ※本ツールは、1995年・2010年・2025年の税制・社会保険料率に基づいて計算しています。
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
