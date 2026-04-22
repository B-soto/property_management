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
      default: "#0f1117",
      paper: "#1a1f2e",
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
      primary: "#e2e8f0",
      secondary: "#94a3b8",
    },
    divider: "#252d3d",
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
        body: { backgroundColor: "#0f1117" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1a1f2e",
          border: "1px solid #2a3142",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1a1f2e",
          border: "1px solid #2a3142",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#13161f",
          borderRight: "1px solid #222838",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            backgroundColor: "#141824",
            color: "#64748b",
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            borderBottom: "1px solid #2a3142",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "1px solid #222838" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "#1f2535" },
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
          color: "#64748b",
          "&.Mui-selected": { color: "#e2e8f0" },
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
          backgroundColor: "#1a1f2e",
          border: "1px solid #2a3142",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#2a3142" },
            "&:hover fieldset": { borderColor: "#3d4f6b" },
            "&.Mui-focused fieldset": { borderColor: "#06b6d4" },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a3142" },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "#222838" },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          "&.Mui-selected": {
            backgroundColor: "#1e2a3a",
            "&:hover": { backgroundColor: "#243347" },
          },
          "&:hover": { backgroundColor: "#1a1f2e" },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: { "& .MuiAlert-root": { border: "1px solid #2a3142" } },
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
