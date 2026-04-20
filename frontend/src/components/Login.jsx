// Login Component - User authentication with JWT tokens
import { React, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card, 
  CardContent,
  Stack,
  Link as MuiLink,
  Alert
} from "@mui/material";
import { 
  LoginOutlined,
  PersonAddOutlined 
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MyTextField from "./forms/MyTextField";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
  });

  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: "",
      password: ""
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    
    const result = await login(data.username, data.password);
    
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ 
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        borderRadius: 4,
        overflow: "hidden"
      }}>
        <Box sx={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          p: 4,
          textAlign: "center"
        }}>
          <LoginOutlined sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Sign in to access your PropManager Pro account
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <MyTextField
                label="Username"
                name="username"
                control={control}
                placeholder="Enter your username"
                width="100%"
              />
              
              <MyTextField
                label="Password"
                name="password"
                control={control}
                placeholder="Enter your password"
                width="100%"
                type="password"
              />
              
              <Button 
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
                  }
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Stack>
          </form>
          
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <MuiLink component={Link} to="/register" sx={{ fontWeight: 600 }}>
                Sign up here
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;