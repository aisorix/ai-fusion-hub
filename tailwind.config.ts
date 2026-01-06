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
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
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
          400: "hsl(var(--cyan-400))",
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
          400: "hsl(var(--teal-400))",
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
        "4xl": "2rem",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        glow: "0 0 30px hsl(var(--cyan-500) / 0.3)",
        "glow-lg": "0 0 60px hsl(var(--cyan-500) / 0.4)",
        neon: "0 0 20px hsl(var(--primary) / 0.5), 0 0 40px hsl(var(--primary) / 0.3)",
        futuristic: "0 4px 24px -1px rgba(0, 0, 0, 0.1), 0 0 40px -10px hsl(var(--primary) / 0.15)",
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        float: "float 3s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "gradient-x": "gradient-x 8s ease infinite",
      },
      backdropBlur: {
        xs: "2px",
        "3xl": "64px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;