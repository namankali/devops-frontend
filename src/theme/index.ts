import { createTheme, alpha, type Shadows } from "@mui/material/styles";

const CustomShadows: Shadows = [
  "none",
  "0px 2px 8px rgba(0,0,0,0.3)",
  "0px 4px 16px rgba(0,0,0,0.35)",
  "0px 8px 24px rgba(0,0,0,0.4)",
  ...Array(21).fill("0px 8px 32px rgba(0,0,0,0.45)"),
] as Shadows

export const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#00e5ff",
      light: "#6effff",
      dark: "#00b2cc",
    },

    secondary: {
      main: "#8b5cf6",
    },

    background: {
      default: "#0a0f1c",
      paper: "rgba(255,255,255,0.04)",
    },

    text: {
      primary: "#e6edf3",
      secondary: "#9aa4b2",
    },

    divider: "rgba(255,255,255,0.08)",

    success: {
      main: "#22c55e",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",

    h5: {
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },

    body1: {
      fontSize: "0.95rem",
    },

    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 14,
  },

  spacing: 8,

  shadows: CustomShadows,

  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },

    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          padding: "6px 14px",
        }),

        contained: ({ theme }) => ({
          boxShadow: "none",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }),
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            background: "rgba(255,255,255,0.03)",
            borderRadius: 10,
          },
        }),
      },
    },
  },
});