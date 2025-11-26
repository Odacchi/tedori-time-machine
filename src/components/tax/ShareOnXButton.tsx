import { Button } from "@/components/ui/button";
import { TaxResult } from "@/domain/tax/model";
import { XIcon } from "@/components/tax/XIcon";

type Props = {
    currentUrl: string;
    result1995: TaxResult;
    result2025: TaxResult;
};

export function ShareOnXButton({ currentUrl, result1995, result2025 }: Props) {
    const diffNet = result2025.breakdown.netIncome - result1995.breakdown.netIncome;
    const absDiff = Math.abs(diffNet);
    const isDown = diffNet < 0;

    const netRate95 = result1995.breakdown.netRateOnGross;
    const netRate25 = result2025.breakdown.netRateOnGross;
    const percentDownOnGross = (netRate25 / netRate95 - 1) * 100;

    const netRateLabor95 = result1995.breakdown.netRateOnLaborCost;
    const netRateLabor25 = result2025.breakdown.netRateOnLaborCost;
    const percentDownOnLaborCost = (netRateLabor25 / netRateLabor95 - 1) * 100;

    let text = "";
    if (isDown) {
        text = `手取りタイムマシンでシミュレーションしたら、1995年頃と比べて手取りが年間${(absDiff / 10000).toLocaleString()}万円（額面ベースで約${Math.abs(Math.round(percentDownOnGross))}% Down、会社の人件費ベースでは約${Math.abs(Math.round(percentDownOnLaborCost))}% Down）になっていました…。\n#手取りタイムマシン #社会保険料`;
    } else {
        text = `条件によっては1995年頃より手取りが増えるケースも？年間${(absDiff / 10000).toLocaleString()}万円（額面ベースで約${Math.abs(Math.round(percentDownOnGross))}% Up、会社の人件費ベースでは約${Math.abs(Math.round(percentDownOnLaborCost))}% Up）という結果に。\n#手取りタイムマシン #社会保険料`;
    }

    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;

    return (
        <Button asChild className="w-full bg-black hover:bg-gray-800 text-white" size="lg">
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <XIcon className="w-5 h-5" />
                Xでこの結果を共有する
            </a>
        </Button>
    );
}
