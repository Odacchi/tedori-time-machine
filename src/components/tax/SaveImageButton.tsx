import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    onClick: () => void;
    isSaving: boolean;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

export function SaveImageButton({ onClick, isSaving, className, variant = "secondary" }: Props) {
    return (
        <Button
            variant={variant}
            size="sm"
            className={cn("gap-2", className)}
            onClick={onClick}
            disabled={isSaving}
        >
            <Download className="w-4 h-4" />
            {isSaving ? "画像を生成中…" : "画像として保存"}
        </Button>
    );
}
