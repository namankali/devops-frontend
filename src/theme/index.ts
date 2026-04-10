import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#00e5ff",
        },
        secondary: {
            main: "#6a11cb",
        },
        background: {
            default: "#0a0f1c",
            paper: "rgba(255,255,255,0.05)",
        },
    },

    typography: {
        fontFamily: "Inter, sans-serif",
        h5: {
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 12,
    },
});