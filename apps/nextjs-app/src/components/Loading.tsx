import React from "react";

export const Loading: React.FC = (props) => (
    <div
        className={"flex flex-col gap-8 items-center justify-center h-full p-8"}
    >
        <header>
            <h1 className={"text-2xl"}>Dice 10 000</h1>
        </header>
        <main className={"flex flex-col gap-2 items-center justify-center"}>
            <span role={"progressbar"}>
                {/* From https://tailwindcss.com/docs/animation#spin (tailwindcss docs for v3.1.8, 2022-08-28) */}
                <svg
                    className="animate-spin -ml-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </span>
            <span>Loading…</span>
        </main>
    </div>
);
