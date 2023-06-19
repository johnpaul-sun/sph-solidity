module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                base: "#575655",
                dark: "#500B0B",
                disabled: "#949BA1",
                white: "#FFFFFF",
                blue: "#4391DA",
                success: "#609876",
                danger: "#9F3030",
                warning: "#FFD700",
                primary: {
                    50: "#CF7A1E",
                    100: "#EAE5E5",
                    200: "#DACACA",
                    300: "#C29494",
                    400: "#B25252",
                    500: "#882A2A",
                    700: "#611616",
                    900: "#500B0B"
                },
                secondary: {
                    50: "#F8F6F5",
                    100: "#E8E0DD",
                    200: "#D9C5BC",
                    300: "#BFA89E",
                    400: "#A69083",
                    500: "#857064"
                }
            },
            fontFamily: {
                mono: ["Space Mono", "monospace"]
            },
            backgroundImage: {
                gradient: "linear-gradient(180deg, #F39D40 0%, #AC3971 100%)",
                "gradient-container":
                    "linear-gradient(180deg, #F0F0F0 0%, #F5DED4 100%)"
            },
            spacing: {
                "8xl": "96rem",
                "9xl": "128rem"
            },
            borderRadius: {
                "4xl": "2rem"
            }
        }
    }
};
