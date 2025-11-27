"use client";

import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/tax/XIcon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { BriefcaseBusiness, ArrowRight, TrendingDown, TrendingUp, Download, User, Users, Baby, ChevronDown } from "lucide-react";
import { toPng } from "html-to-image";
import { TaxInput } from "@/domain/tax/model";

type Props = {
    comparisons: {
        baseYear: "1995" | "2010";
        label: string;
        baseNetIncome: number;
        currentNetIncome: number;
        baseLaborCost: number;
        currentLaborCost: number;
        diffNet: number; // 2025 - base
        percentDownOnGross: number;
        percentDownOnLaborCost: number;
        burdenDiff: {
            incomeTax: number;
            residentTax: number;
            social: number;
        };
    }[];
    currentUrl?: string;
    isSalaryZero?: boolean;
    input?: TaxInput;
};

const PIE_COLORS = ["#8aa3f5", "#7dc6a1", "#e58c8c"];

type ComparisonNoteProps = {
    era: "1995" | "2010";
};

const ComparisonNote = ({ era }: ComparisonNoteProps) => {
    if (era === "1995") {
        return (
            <p className="text-xs text-muted-foreground leading-relaxed">
                1995年ごろにはまだ介護保険料がなく、社会保険料率もいまより低く、子どものいる世帯には年少扶養控除もありました。2025年ごろでは介護保険料の新設や社会保険料率の引き上げ、年少扶養控除の廃止などが重なり、同じ年収でもここまで手取りが減っています。
            </p>
        );
    }
    return (
        <p className="text-xs text-muted-foreground leading-relaxed">
            2010年ごろには介護保険料はすでにありましたが、いまより保険料率は低く、16歳未満の子どもには年少扶養控除も残っていました。2025年ごろでは社会保険料率のさらなる引き上げと年少扶養控除の廃止が重なり、同じ年収でも2010年より手取りが減りやすくなっています。
        </p>
    );
};

function DiffHighlightCard({ comparisons, currentUrl, isSalaryZero = false, input }: Props) {
    if (isSalaryZero) {
        return (
            <Card className="flex flex-col h-full overflow-hidden border border-amber-200 shadow-[0_8px_30px_-12px_rgba(251,191,36,0.4)]">
                <CardHeader className="pb-2 bg-transparent">
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                        <BriefcaseBusiness className="w-5 h-5" />
                        まずは収入を入力してください
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                        ※本気でシミュレーションしたい方は、まずは働きましょう…？
                    </p>
                    <p className="text-xs text-muted-foreground">
                        年収（万円）を入力すると、1995/2010/2025の比較が表示されます。
                    </p>
                </CardContent>
            </Card>
        );
    }

    const [selected, setSelected] = useState<"1995" | "2010">("1995");
    const [isSaving, setIsSaving] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const captureRef = useRef<HTMLDivElement>(null);
    const selectedComparison = useMemo(
        () => comparisons.find((c) => c.baseYear === selected) ?? comparisons[0],
        [comparisons, selected]
    );

    const isDown = selectedComparison.diffNet < 0;
    const absDiff = Math.abs(selectedComparison.diffNet);
    const monthlyDiff = Math.round(absDiff / 12);
    const barData = [
        { name: "所得税", value: selectedComparison.burdenDiff.incomeTax, fill: PIE_COLORS[0] },
        { name: "住民税", value: selectedComparison.burdenDiff.residentTax, fill: PIE_COLORS[1] },
        { name: "社会保険料", value: selectedComparison.burdenDiff.social, fill: PIE_COLORS[2] },
    ];
    const hasAnyChange = barData.some((item) => item.value !== 0);

    // Share text generation
    let shareText = "";
    if (isDown) {
        shareText = `手取りタイムマシンでシミュレーションしたら、${selectedComparison.label}と比べて手取りが年間${(absDiff / 10000).toLocaleString()}万円（額面ベースで約${Math.abs(Math.round(selectedComparison.percentDownOnGross))}% Down、会社の人件費ベースでは約${Math.abs(Math.round(selectedComparison.percentDownOnLaborCost))}% Down）になっていました…。\n#手取りタイムマシン #社会保険料`;
    } else {
        shareText = `条件によっては${selectedComparison.label}より手取りが増えるケースも？年間${(absDiff / 10000).toLocaleString()}万円（額面ベースで約${Math.abs(Math.round(selectedComparison.percentDownOnGross))}% Up、会社の人件費ベースでは約${Math.abs(Math.round(selectedComparison.percentDownOnLaborCost))}% Up）という結果に。\n#手取りタイムマシン #社会保険料`;
    }
    const shareUrl = currentUrl ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}` : "#";

    const handleDownloadImage = useCallback(async () => {
        if (!captureRef.current) return;
        setIsSaving(true);
        setIsCapturing(true);
        // Wait for state update to reflect (hide buttons etc)
        await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

        try {
            const dataUrl = await toPng(captureRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
                filter: (node) => {
                    if (!(node instanceof HTMLElement)) return true;
                    return node.dataset.ignoreCapture !== "true";
                },
            });

            const suffix = selectedComparison.baseYear === "1995" ? "vs-1995" : "vs-2010";
            const fileName = `tedori-highlight-${suffix}.png`;

            // Detect mobile device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // Try Web Share API only on mobile
            if (isMobile && navigator.share) {
                try {
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], fileName, { type: "image/png" });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: '手取りタイムマシン',
                            text: shareText
                        });
                        return; // Success, exit
                    }
                } catch (shareError) {
                    // Share failed or cancelled, fall back to download
                    console.log("Web Share API failed, falling back to download", shareError);
                }
            }

            // Fallback: Download link (Desktop or non-share browsers)
            const link = document.createElement("a");
            link.download = fileName;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("failed to save highlight card", error);
        } finally {
            setIsSaving(false);
            setIsCapturing(false);
        }
    }, [selectedComparison.baseYear, shareText]);

    // Helper to render family icons
    const renderFamilyIcons = () => {
        if (!input) return null;
        const totalChildren = input.children.under16 + input.children.age16to18 + input.children.age19to23;

        return (
            <div className="flex items-center gap-1 text-slate-600">
                <div className="flex flex-col items-center">
                    <User className="w-5 h-5" />
                    <span className="text-[10px] leading-none mt-0.5">本人</span>
                </div>
                {input.spouse === "dependent" && (
                    <div className="flex flex-col items-center ml-1">
                        <Users className="w-5 h-5" />
                        <span className="text-[10px] leading-none mt-0.5">配偶者</span>
                    </div>
                )}
                {totalChildren > 0 && (
                    <div className="flex flex-col items-center ml-1">
                        <div className="flex -space-x-1">
                            {Array.from({ length: Math.min(totalChildren, 5) }).map((_, i) => (
                                <Baby key={i} className="w-5 h-5" />
                            ))}
                            {totalChildren > 5 && <span className="text-xs self-end">...</span>}
                        </div>
                        <span className="text-[10px] leading-none mt-0.5">子{totalChildren}人</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div ref={captureRef} className="h-full relative">
            <Card
                className={cn(
                    "flex flex-col gap-0 h-full overflow-hidden border transition-all duration-300",
                    isDown
                        ? "border-[#e58c8c] shadow-[0_8px_30px_-12px_rgba(229,140,140,0.4)]"
                        : "border-[#7dc6a1] shadow-[0_8px_30px_-12px_rgba(125,198,161,0.4)]",
                    isCapturing && "shadow-none"
                )}
            >
                <CardHeader className={cn(
                    "pb-2 bg-transparent"
                )}>
                    <div className="flex items-center justify-between gap-3">
                        <CardTitle className="flex items-center gap-2">
                            {isDown ? <TrendingDown className="w-5 h-5 text-[#e58c8c]" /> : <TrendingUp className="w-5 h-5 text-[#7dc6a1]" />}
                            手取り比較
                        </CardTitle>
                        <Tabs
                            value={selected}
                            onValueChange={(v) => setSelected((v as "1995" | "2010") ?? "1995")}
                        >
                            <TabsList className="grid grid-cols-2 h-8">
                                <TabsTrigger value="1995" className="text-xs px-2">vs 1995年</TabsTrigger>
                                <TabsTrigger value="2010" className="text-xs px-2">vs 2010年</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>

                {/* Add extra bottom padding while capturing so the watermark has breathing room */}
                <CardContent className={cn("space-y-4 flex-1 pt-4 pb-5", isCapturing && "pb-3")}>
                    {/* Assumptions Header */}
                    {input && (
                        <div className="flex flex-col items-center justify-center pb-2 border-b border-dashed">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">額面年収</p>
                                    <p className="text-xl font-bold text-slate-700">
                                        {(input.annualSalary / 10000).toLocaleString()}
                                        <span className="text-sm font-normal ml-0.5">万円</span>
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-border" />
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground font-medium mb-1">家族構成</p>
                                    {renderFamilyIcons()}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Comparison Display */}
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="flex items-center justify-center gap-4 w-full max-w-sm">
                            <div className="text-center flex-1">
                                <p className="text-xs text-muted-foreground font-medium mb-1">{selectedComparison.label}</p>
                                <p className="text-lg font-bold text-slate-600">
                                    {(selectedComparison.baseNetIncome / 10000).toLocaleString()}
                                    <span className="text-xs font-normal ml-0.5">万円</span>
                                </p>
                            </div>

                            <ArrowRight className="w-5 h-5 text-muted-foreground/50" />

                            <div className="text-center flex-1">
                                <p className="text-xs text-muted-foreground font-medium mb-1">2025年</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {(selectedComparison.currentNetIncome / 10000).toLocaleString()}
                                    <span className="text-xs font-normal ml-0.5">万円</span>
                                </p>
                            </div>
                        </div>

                        <div className={cn("text-center px-6 py-3 rounded-xl border-2 w-full max-w-sm transition-colors", isDown ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200")}>
                            <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-0.5", isDown ? "text-red-600" : "text-emerald-600")}>
                                DIFFERENCE
                            </p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className={cn("text-3xl font-black tracking-tight drop-shadow-sm", isDown ? "text-red-600" : "text-emerald-600")}>
                                    {isDown ? "△" : "+"}
                                    {(absDiff / 10000).toLocaleString()}
                                </span>
                                <span className={cn("text-sm font-bold", isDown ? "text-red-600" : "text-emerald-600")}>万円</span>
                            </div>
                            <p className={cn("text-[10px] mt-0.5 font-bold", isDown ? "text-red-600/90" : "text-emerald-600/90")}>
                                （月あたり約 {monthlyDiff.toLocaleString()}円の{isDown ? "減少" : "増加"}）
                            </p>
                        </div>

                        {/* Labor Cost Comparison */}
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">
                                <span className="inline-block bg-slate-100 rounded px-1.5 py-0.5 mr-1">会社から見た人件費</span>
                                {(selectedComparison.baseLaborCost / 10000).toLocaleString()}万円
                                <ArrowRight className="w-3 h-3 inline mx-1" />
                                {(selectedComparison.currentLaborCost / 10000).toLocaleString()}万円
                            </p>
                        </div>
                    </div>

                    {/* Burden Breakdown Chart */}
                    {isDown && hasAnyChange && (
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground pl-1">
                                負担増の内訳（年間）
                            </p>
                            <div className="border rounded-lg p-3 bg-muted/30">
                                <div className="flex flex-col gap-3">
                                    <div className="h-24 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={barData}
                                                layout="vertical"
                                                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                <XAxis
                                                    type="number"
                                                    tickFormatter={(value) => `${Math.round(value / 10000)}万`}
                                                    fontSize={10}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    width={65}
                                                    tick={{ fontSize: 11 }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <Tooltip
                                                    formatter={(value: number) => `${value.toLocaleString()}円`}
                                                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                                    cursor={{ fill: 'transparent' }}
                                                />
                                                <ReferenceLine x={0} stroke="#9ca3af" />
                                                <Bar
                                                    dataKey="value"
                                                    radius={[0, 4, 4, 0]}
                                                    barSize={20}
                                                >
                                                    {barData.map((entry) => (
                                                        <Cell key={entry.name} fill={entry.fill} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-right">
                                        ※増えた負担の多くは<span className="font-bold text-emerald-600">「社会保険料」</span>によるものです
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div
                        className={cn(
                            "border rounded-lg bg-muted/20",
                            isCapturing && !showDetails ? "hidden" : "block"
                        )}
                    >
                        <button
                            type="button"
                            onClick={() => setShowDetails((prev) => !prev)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                            <span>{showDetails ? "説明を隠す" : "説明を表示"}</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", showDetails && "rotate-180")} />
                        </button>
                        {showDetails && (
                            <div className="px-3 pb-3 pt-1 space-y-3">
                                <ComparisonNote era={selectedComparison.baseYear} />

                                {selectedComparison.baseYear === "1995" && (
                                    <div className="pt-2 border-t">
                                        <p className="text-[10px] text-muted-foreground bg-muted/50 border rounded px-2 py-1.5 leading-relaxed">
                                            ※1995年当時はボーナスへの社会保険料負担が軽かったため、ボーナス比率が高い場合は実際の手取り減はさらに大きくなる可能性があります。
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter
                    className={cn("pt-0 pb-4 flex flex-col gap-2", isCapturing && "hidden")}
                    data-ignore-capture="true"
                >
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs h-9"
                        onClick={handleDownloadImage}
                        disabled={isSaving}
                    >
                        <Download className="w-4 h-4" />
                        {isSaving ? "画像を生成中…" : "画像として保存"}
                    </Button>

                    {currentUrl && (
                        <Button variant="outline" size="sm" asChild className="w-full text-xs h-9">
                            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                <XIcon className="w-3.5 h-3.5" />
                                この結果をXで共有
                            </a>
                        </Button>
                    )}
                </CardFooter>
            </Card>
            {isCapturing && (
                <div className="absolute right-6 bottom-4 text-[11px] font-semibold text-slate-600 pointer-events-none select-none">
                    手取りタイムマシン
                </div>
            )}
        </div>
    );
}

export { DiffHighlightCard };
