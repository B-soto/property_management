import { React } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Stack,
  Chip,
  Avatar
} from "@mui/material";
import { 
  HomeWork,
  TrendingUp,
  Security,
  Add as AddIcon,
  Visibility as ViewIcon,
  Dashboard,
  Analytics,
  ManageAccounts
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box 
        sx={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 12,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.1)",
            zIndex: 1
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip 
              label="Modern Property Management" 
              sx={{ 
                mb: 3, 
                bgcolor: "rgba(255,255,255,0.2)", 
                color: "white",
                fontWeight: 600 
              }} 
            />
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 800, 
                fontSize: { xs: "2.5rem", md: "4rem" },
                mb: 3,
                background: "linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              PropManager Pro
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mb: 5, 
                maxWidth: 700, 
                mx: "auto",
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Transform your property management with AI-powered insights, 
              real-time tracking, and seamless project coordination
            </Typography>
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={3} 
              justifyContent="center"
              sx={{ mb: 8 }}
            >
              <Button 
                variant="contained" 
                size="large"
                component={Link}
                to="/create"
                startIcon={<AddIcon />}
                sx={{ 
                  px: 6, 
                  py: 2,
                  bgcolor: "white",
                  color: "primary.main",
                  fontWeight: 600,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  "&:hover": {
                    bgcolor: "grey.100",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Start New Project
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                component={Link}
                to="/projects"
                startIcon={<ViewIcon />}
                sx={{ 
                  px: 6, 
                  py: 2,
                  borderColor: "white",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderColor: "white",
                    transform: "translateY(-2px)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                View Portfolio
              </Button>
            </Stack>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <Avatar sx={{ 
                  bgcolor: "rgba(255,255,255,0.2)", 
                  width: 60, 
                  height: 60, 
                  mx: "auto", 
                  mb: 2 
                }}>
                  <Dashboard sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Real-time Dashboard
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Monitor all projects at a glance
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <Avatar sx={{ 
                  bgcolor: "rgba(255,255,255,0.2)", 
                  width: 60, 
                  height: 60, 
                  mx: "auto", 
                  mb: 2 
                }}>
                  <Analytics sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Smart Analytics
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Data-driven insights and reports
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <Avatar sx={{ 
                  bgcolor: "rgba(255,255,255,0.2)", 
                  width: 60, 
                  height: 60, 
                  mx: "auto", 
                  mb: 2 
                }}>
                  <ManageAccounts sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Team Management
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Collaborate with your team
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            Why Choose PropManager Pro?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Built for modern property professionals who demand efficiency and results
          </Typography>
        </Box>

        <Grid container spacing={6} sx={{ mb: 10 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: "100%", 
              textAlign: "center", 
              p: 4,
              border: "1px solid",
              borderColor: "grey.200",
              borderRadius: 4,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                borderColor: "primary.main"
              }
            }}>
              <CardContent>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: "50%", 
                  bgcolor: "primary.light", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  mx: "auto", 
                  mb: 3 
                }}>
                  <HomeWork sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Smart Project Tracking
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Advanced timeline management with milestone tracking, automated 
                  notifications, and real-time progress updates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: "100%", 
              textAlign: "center", 
              p: 4,
              border: "1px solid",
              borderColor: "grey.200",
              borderRadius: 4,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                borderColor: "primary.main"
              }
            }}>
              <CardContent>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: "50%", 
                  bgcolor: "success.light", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  mx: "auto", 
                  mb: 3 
                }}>
                  <TrendingUp sx={{ fontSize: 40, color: "success.main" }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Performance Analytics
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Comprehensive reporting dashboard with ROI tracking, cost analysis, 
                  and predictive insights for better decision making
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: "100%", 
              textAlign: "center", 
              p: 4,
              border: "1px solid",
              borderColor: "grey.200",
              borderRadius: 4,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                borderColor: "primary.main"
              }
            }}>
              <CardContent>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: "50%", 
                  bgcolor: "warning.light", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  mx: "auto", 
                  mb: 3 
                }}>
                  <Security sx={{ fontSize: 40, color: "warning.main" }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Secure & Compliant
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Enterprise-grade security with data encryption, role-based access, 
                  and compliance with industry standards
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box 
          sx={{ 
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            borderRadius: 6, 
            p: 8, 
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "linear-gradient(45deg, rgba(103,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
              zIndex: 1
            }}
          />
          <Box sx={{ position: "relative", zIndex: 2 }}>
            <Typography variant="h3" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Ready to Transform Your Business?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
              Join thousands of property professionals who trust PropManager Pro 
              to streamline their operations
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
              <Button 
                variant="contained" 
                size="large"
                component={Link}
                to="/create"
                startIcon={<AddIcon />}
                sx={{ 
                  px: 6, 
                  py: 2,
                  fontWeight: 600,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Start Free Today
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                component={Link}
                to="/projects"
                startIcon={<ViewIcon />}
                sx={{ 
                  px: 6, 
                  py: 2,
                  fontWeight: 600,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  "&:hover": {
                    transform: "translateY(-2px)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                View Demo
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
