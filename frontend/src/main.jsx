import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0e0e0e",
      paper: "#161616",
    },
    primary: {
      main: "#06b6d4",
      light: "#22d3ee",
      dark: "#0891b2",
    },
    secondary: {
      main: "#FF6B35",
      light: "#FF8C60",
      dark: "#CC4A1A",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#888888",
    },
    divider: "#2A2A2A",
    success: { main: "#22C55E" },
    warning: { main: "#F59E0B" },
    error: { main: "#EF4444" },
    info: { main: "#3B82F6" },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#0a0a0a" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#141414",
          border: "1px solid #222222",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#141414",
          border: "1px solid #222222",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0d0d0d",
          borderRight: "1px solid #1f1f1f",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            backgroundColor: "#111111",
            color: "#666666",
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            borderBottom: "1px solid #222222",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "1px solid #1f1f1f" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "#1a1a1a" },
          "&:last-child td": { borderBottom: 0 },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, boxShadow: "none" },
        contained: {
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 600, fontSize: "0.72rem" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#555555",
          "&.Mui-selected": { color: "#FFFFFF" },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: "#06b6d4" },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#141414",
          border: "1px solid #2a2a2a",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#2a2a2a" },
            "&:hover fieldset": { borderColor: "#444444" },
            "&.Mui-focused fieldset": { borderColor: "#06b6d4" },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a2a2a" },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "#1f1f1f" },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          "&.Mui-selected": {
            backgroundColor: "#1f1f1f",
            "&:hover": { backgroundColor: "#252525" },
          },
          "&:hover": { backgroundColor: "#161616" },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: { "& .MuiAlert-root": { border: "1px solid #2a2a2a" } },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </Router>
);
