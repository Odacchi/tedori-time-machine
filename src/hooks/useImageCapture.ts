import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";

type UseImageCaptureOptions = {
    fileName: string;
    shareTitle?: string;
};

export const useImageCapture = ({ fileName, shareTitle = "手取りタイムマシン" }: UseImageCaptureOptions) => {
    const captureRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const capture = useCallback(async (shareText?: string) => {
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

            // Detect mobile device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // Try Web Share API only on mobile
            if (isMobile && navigator.share && shareText) {
                try {
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], fileName, { type: "image/png" });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: shareTitle,
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
            console.error("failed to save image", error);
        } finally {
            setIsSaving(false);
            setIsCapturing(false);
        }
    }, [fileName, shareTitle]);

    return {
        captureRef,
        capture,
        isCapturing,
        isSaving,
    };
};
