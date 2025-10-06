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
      // ----------------------------------------------------
      // PIGRE: Adições de Estilo Console Técnico
      // ----------------------------------------------------
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        // Usando Space Mono para um visual mais técnico, se já estiver instalada/importada
        'mono': ['Space Mono', 'monospace', 'Roboto Mono'],
        'technical': ['Inter', 'sans-serif'],
      },
      colors: {
        // Cores de Status PIGRE (Definições estáticas para o tema Tech)
        'success': '#4ade80', // Neon Green
        'warning': '#facc15', // Yellow
        'accent': '#2dd4bf', // Teal/Cyan
        'primary': {
          DEFAULT: "#8b5cf6", // Violet/Purple for main actions
          foreground: "hsl(var(--primary-foreground))",
        },
        // Mantenha o restante das cores originais
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... (outras cores)
      },
      backgroundImage: {
        // Gradientes customizados (pode precisar de uma definição em seu CSS global)
        // Se você usar o padrão de variáveis, defina isso no seu CSS principal:
        // --gradient-technical: linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%);
        // --gradient-mission: radial-gradient(ellipse at center, rgba(17, 24, 39, 1) 0%, rgba(1, 4, 9, 1) 70%);

       "gradient-mission": "radial-gradient(ellipse at center, rgba(45, 80, 160, 1) 0%, rgba(20, 15, 60, 1) 85%)",



        "gradient-technical": "linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)",

        // Mantenha os seus gradientes existentes
        "gradient-energy": "var(--gradient-energy)",
        "gradient-critical": "var(--gradient-critical)",
      },
      boxShadow: {
        // Sombras customizadas para o visual do console
        'console': '0 0 15px rgba(45, 212, 191, 0.2), 0 0 5px rgba(74, 222, 128, 0.1)',
        'active': '0 0 10px #4ade80',
        'critical': '0 0 10px #ef4444', // Exemplo de sombra crítica
        
        // Mantenha os seus
        "grid": "var(--shadow-grid)",
      },
      // ----------------------------------------------------
      // FIM das Adições PIGRE
      // ----------------------------------------------------
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "console-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "grid-scan": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "console-blink": "console-blink 1.5s ease-in-out infinite",
        "grid-scan": "grid-scan 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
