import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  HomeWork,
  Dashboard,
  Add as AddIcon,
  ViewList,
  Info as InfoIcon,
  House as HouseIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { IconButton, Avatar, Stack, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Logout as LogoutIcon, AccountCircle } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";

const CYAN = "#06b6d4";
const CYAN_DIM = "rgba(6,182,212,0.08)";
const CYAN_DIM_HOVER = "rgba(6,182,212,0.14)";

const navItemSx = (selected) => ({
  borderRadius: "6px",
  mx: 1,
  color: selected ? CYAN : "#888",
  bgcolor: selected ? CYAN_DIM : "transparent",
  "&:hover": { bgcolor: CYAN_DIM_HOVER, color: "#fff" },
  transition: "all 0.15s ease",
});

export default function NavBar(props) {
  const { drawerWidth, content } = props;
  const location = useLocation();
  const path = location.pathname;
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => logout();

  const myDrawer = (
    <Box sx={{ bgcolor: "#0d0d0d", height: "100%", borderRight: "1px solid #1a1a1a" }}>
      <Toolbar />

      {/* Logo */}
      <Box sx={{ px: 3, py: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${CYAN} 0%, #0ea5e9 100%)` }}>
            <HomeWork sx={{ fontSize: 20, color: "#000" }} />
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: CYAN, lineHeight: 1.1 }}>
              PropManager
            </Typography>
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#333", letterSpacing: 2 }}>
              PRO
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "#1a1a1a" }} />

      <Box sx={{ overflow: "auto", px: 1, py: 2 }}>
        <List dense>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton component={Link} to="/" selected={"/" === path} sx={navItemSx("/" === path)}>
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}><HouseIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton component={Link} to="/about" selected={"/about" === path} sx={navItemSx("/about" === path)}>
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}><InfoIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="About" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }} />
            </ListItemButton>
          </ListItem>
        </List>

        {isAuthenticated && (
          <>
            <Divider sx={{ borderColor: "#1a1a1a", my: 1.5 }} />
            <Typography sx={{ px: 2, pb: 1, fontSize: "0.65rem", fontWeight: 700, color: "#333", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Properties
            </Typography>
            <List dense>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton component={Link} to="/projects" selected={"/projects" === path} sx={navItemSx("/projects" === path)}>
                  <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}><ViewList fontSize="small" /></ListItemIcon>
                  <ListItemText primary="My Properties" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton component={Link} to="/create" selected={"/create" === path} sx={navItemSx("/create" === path)}>
                  <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}><AddIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Add Property" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }} />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Box>

      {/* Bottom user section */}
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, borderTop: "1px solid #1a1a1a", bgcolor: "#0d0d0d" }}>
        {isAuthenticated ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5, px: 0.5 }}>
              <AccountCircle sx={{ color: CYAN, fontSize: 28 }} />
              <Box>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff" }}>
                  {user?.username || "User"}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: "#444" }}>Logged in</Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderColor: "#2a2a2a", color: "#666", "&:hover": { borderColor: "#ef4444", color: "#ef4444", bgcolor: "rgba(239,68,68,0.05)" }, borderRadius: "6px", textTransform: "none", fontWeight: 600 }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Stack spacing={1}>
            <Button fullWidth component={Link} to="/login" variant="outlined" size="small"
              sx={{ borderColor: CYAN, color: CYAN, "&:hover": { bgcolor: CYAN_DIM }, borderRadius: "6px", textTransform: "none", fontWeight: 600 }}>
              Login
            </Button>
            <Button fullWidth component={Link} to="/register" variant="outlined" size="small"
              sx={{ borderColor: "#2a2a2a", color: "#888", "&:hover": { borderColor: "#fff", color: "#fff" }, borderRadius: "6px", textTransform: "none", fontWeight: 600 }}>
              Register
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#0d0d0d",
          borderBottom: "1px solid #1a1a1a",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton color="inherit" onClick={() => setOpen(!open)} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
            <Avatar sx={{ width: 32, height: 32, background: `linear-gradient(135deg, ${CYAN} 0%, #0ea5e9 100%)`, display: { xs: "none", sm: "flex" } }}>
              <HomeWork sx={{ fontSize: 18, color: "#000" }} />
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: "1.1rem", lineHeight: 1 }}>
                PropManager Pro
              </Typography>
              <Typography sx={{ color: "#333", fontWeight: 600, fontSize: "0.6rem", letterSpacing: 2 }}>
                SOUTHWEST FLORIDA
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            <IconButton component={Link} to="/projects" sx={{ color: "#555", "&:hover": { color: CYAN } }}>
              <Dashboard fontSize="small" />
            </IconButton>
            <IconButton component={Link} to="/create" sx={{ color: "#555", "&:hover": { color: CYAN } }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", bgcolor: "#0d0d0d", border: "none" } }}>
        {myDrawer}
      </Drawer>

      <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} sx={{ display: { xs: "block", sm: "none" }, width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", bgcolor: "#0d0d0d" } }}>
        {myDrawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#0e0e0e", minHeight: "100vh" }}>
        <Toolbar sx={{ minHeight: 64 }} />
        {content}
      </Box>
    </Box>
  );
}
