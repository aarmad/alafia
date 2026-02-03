import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "hsl(142, 76%, 36%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                secondary: {
                    DEFAULT: "hsl(142, 30%, 85%)",
                    foreground: "hsl(142, 76%, 20%)",
                },
                accent: {
                    DEFAULT: "hsl(173, 58%, 39%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                background: "hsl(0, 0%, 100%)",
                foreground: "hsl(142, 10%, 10%)",
                card: {
                    DEFAULT: "hsl(0, 0%, 100%)",
                    foreground: "hsl(142, 10%, 10%)",
                },
                muted: {
                    DEFAULT: "hsl(142, 30%, 95%)",
                    foreground: "hsl(142, 10%, 40%)",
                },
                border: "hsl(142, 30%, 90%)",
                input: "hsl(142, 30%, 90%)",
                ring: "hsl(142, 76%, 36%)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
} satisfies Config;
