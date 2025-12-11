module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#07121a",
        panel: "#071926",
        accent: {
          DEFAULT: "#7c3aed",
          light: "#9f7aea"
        }
      },
      dropShadow: {
        "neon": "0 6px 24px rgba(124,58,237,0.16)"
      },
      keyframes: {
        pulseNode: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.06)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        pulseNode: "pulseNode 1.6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
