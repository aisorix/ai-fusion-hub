import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Extended palette
        cyan: {
          500: "hsl(var(--cyan-500))",
          600: "hsl(187 85% 43%)",
        },
        emerald: {
          500: "hsl(var(--emerald-500))",
          600: "hsl(160 84% 34%)",
        },
        purple: {
          500: "hsl(var(--purple-500))",
          600: "hsl(var(--purple-600))",
        },
        pink: {
          500: "hsl(var(--pink-500))",
          600: "hsl(var(--pink-600))",
        },
        indigo: {
          500: "hsl(var(--indigo-500))",
          600: "hsl(239 84% 60%)",
        },
        orange: {
          500: "hsl(var(--orange-500))",
          600: "hsl(25 95% 48%)",
        },
        amber: {
          500: "hsl(var(--amber-500))",
        },
        red: {
          500: "hsl(var(--red-500))",
        },
        rose: {
          500: "hsl(var(--rose-500))",
        },
        teal: {
          500: "hsl(var(--teal-500))",
        },
        violet: {
          600: "hsl(var(--violet-600))",
        },
        green: {
          100: "hsl(142 76% 90%)",
          500: "hsl(var(--green-500))",
          600: "hsl(var(--green-600))",
        },
        blue: {
          500: "hsl(var(--blue-500))",
          600: "hsl(var(--blue-600))",
        },
        gray: {
          50: "hsl(210 20% 98%)",
          100: "hsl(210 20% 96%)",
          200: "hsl(214 32% 91%)",
          300: "hsl(213 27% 84%)",
          400: "hsl(215 20% 65%)",
          500: "hsl(215 16% 47%)",
          600: "hsl(215 19% 35%)",
          700: "hsl(215 25% 27%)",
          800: "hsl(217 33% 17%)",
          900: "hsl(220 20% 10%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
