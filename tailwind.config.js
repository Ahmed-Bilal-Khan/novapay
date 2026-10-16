/**
 * NovaKit Lite — design tokens.
 * These are the shared vocabulary every screen should build from.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand — indigo, with a full tint ramp for surfaces, hovers and emphasis.
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          400: "#818CF8",
          DEFAULT: "#4F46E5", // primary
          pressed: "#3730A3",
          800: "#312E81",
        },
        // Attention — amber, for states that need attention (late, notice before default).
        // Soft background (50) with dark text (neutral-900); 600 only for the short status label.
        // Never a solid fill, so there is no DEFAULT. 100 is not for text (600 on it is 4.31:1).
        attention: {
          50: "#FFF7E6",
          100: "#FDECC8",
          600: "#B45309",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F2F2F2",
          200: "#ECECEC",
          300: "#D9D9D9",
          500: "#6B6B6B",
          700: "#4D4D4D",
          900: "#1A1A1A",
        },
        success: "#15803D",
        // Danger — only on the event that failed, never on a person's status.
        danger: {
          50: "#FEF3F2",
          DEFAULT: "#B42318",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.08)",
      },
      fontSize: {
        display: ["28px", { lineHeight: "34px", fontWeight: "700" }],
        title: ["20px", { lineHeight: "26px", fontWeight: "600" }],
        body: ["15px", { lineHeight: "22px", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
