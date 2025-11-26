import { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

// Simple "X" mark to avoid deprecated Twitter icon
export function XIcon(props: Props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M4 4l16 16" />
            <path d="M20 4L4 20" />
        </svg>
    );
}
