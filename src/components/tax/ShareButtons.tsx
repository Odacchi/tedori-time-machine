"use client";

import { Button } from "@/components/ui/button";
import { TaxResult } from "@/domain/tax/model";
import { XIcon } from "@/components/tax/XIcon";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { LineIcon } from "@/components/icons/LineIcon";
import { Link as LinkIcon, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
    result1995: TaxResult;
    result2025: TaxResult;
    variant?: "hero" | "footer";
    className?: string;
};

export function ShareButtons({ result1995, result2025, variant = "footer", className }: Props) {
    const [copied, setCopied] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        setBaseUrl(window.location.origin + window.location.pathname);
    }, []);

    const diffNet = result2025.breakdown.netIncome - result1995.breakdown.netIncome;
    const absDiff = Math.abs(diffNet);
    const isDown = diffNet < 0;

    const netRate95 = result1995.breakdown.netRateOnGross;
    const netRate25 = result2025.breakdown.netRateOnGross;
    const percentDownOnGross = (netRate25 / netRate95 - 1) * 100;

    const netRateLabor95 = result1995.breakdown.netRateOnLaborCost;
    const netRateLabor25 = result2025.breakdown.netRateOnLaborCost;
    const percentDownOnLaborCost = (netRateLabor25 / netRateLabor95 - 1) * 100;

    const text = `「もし同じ年収で、別の時代に生きていたら手取りはいくら？」\n過去・現在・未来の手取りをグラフで一発比較できる「手取りタイムマシン」。\n税金・社会保険料の変化がひと目でわかります。\n#手取りタイムマシン\n\n`;

    // Use baseUrl for sharing to introduce the tool
    const shareUrl = baseUrl;
    const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const isHero = variant === "hero";

    return (
        <div className={cn(
            "flex gap-3",
            isHero ? "flex-row items-center flex-wrap" : "flex-col",
            className
        )}>
            <div className={cn(
                "flex gap-3",
                isHero ? "contents" : "flex items-center justify-center w-full"
            )}>
                {/* X (Twitter) */}
                <Button asChild className={cn("bg-black hover:bg-gray-800 text-white rounded-xl shadow-sm hover:shadow-md transition-all", isHero ? "h-10 px-4" : "h-12 flex-1")} size={isHero ? "sm" : "lg"}>
                    <a
                        href={xShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-white"
                        style={{ color: "#fff" }}
                    >
                        <XIcon className={cn(isHero ? "w-4 h-4" : "w-5 h-5")} />
                        <span className="font-bold">Post</span>
                    </a>
                </Button>

                {/* Facebook */}
                <Button asChild className={cn("bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl shadow-sm hover:shadow-md transition-all", isHero ? "h-10 px-4" : "h-12 flex-1")} size={isHero ? "sm" : "lg"}>
                    <a
                        href={fbShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-white"
                        style={{ color: "#fff" }}
                    >
                        <FacebookIcon className={cn(isHero ? "w-5 h-5" : "w-6 h-6")} />
                        <span className="font-bold">Share</span>
                    </a>
                </Button>

                {/* LINE */}
                <Button asChild className={cn("bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl shadow-sm hover:shadow-md transition-all", isHero ? "h-10 px-4" : "h-12 flex-1")} size={isHero ? "sm" : "lg"}>
                    <a
                        href={lineShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-white"
                        style={{ color: "#fff" }}
                    >
                        <LineIcon className={cn(isHero ? "w-5 h-5" : "w-6 h-6")} />
                        <span className="font-bold">LINE</span>
                    </a>
                </Button>
            </div>

            {/* Copy Link */}
            <Button
                variant="outline"
                onClick={handleCopy}
                className={cn(
                    "rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors",
                    isHero ? "h-10 w-auto px-4" : "h-10 w-full"
                )}
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4 mr-2 text-emerald-500" />
                        <span className="text-emerald-600 font-medium">Copied</span>
                    </>
                ) : (
                    <>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        URL
                    </>
                )}
            </Button>
        </div>
    );
}
