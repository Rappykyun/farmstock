import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M32 50V24"
                stroke="currentColor"
                strokeWidth="5.5"
                strokeLinecap="round"
            />
            <path
                d="M32 25C25.5 14.5 16 13.5 10 19.5C13.5 29.5 24 33 32 25Z"
                fill="currentColor"
            />
            <path
                d="M32 25C38.5 14.5 48.5 13.5 55 20C51.5 30 40 33.5 32 25Z"
                fill="currentColor"
                opacity="0.78"
            />
            <path
                d="M15 45H49"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            <path
                d="M20 54H44"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
                opacity="0.72"
            />
        </svg>
    );
}
