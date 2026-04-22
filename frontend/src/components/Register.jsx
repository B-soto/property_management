// Register Component - User registration with validation
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
  PersonAddOutlined,
  LoginOutlined 
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MyTextField from "./forms/MyTextField";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const schema = yup.object({
    username: yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup.string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password")
  });

  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    const result = await registerUser({
      username: data.username,
      email: data.email,
      password: data.password
    });
    
    if (result.success) {
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
          background: "linear-gradient(135deg, #0c2340 0%, #0e4f6e 100%)",
          color: "white",
          p: 4,
          textAlign: "center"
        }}>
          <PersonAddOutlined sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Join PropManager Pro
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Create your account to start managing properties
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <MyTextField
                label="Username"
                name="username"
                control={control}
                placeholder="Choose a username"
                width="100%"
              />
              
              <MyTextField
                label="Email"
                name="email"
                control={control}
                placeholder="Enter your email"
                width="100%"
                type="email"
              />
              
              <MyTextField
                label="Password"
                name="password"
                control={control}
                placeholder="Create a password"
                width="100%"
                type="password"
              />
              
              <MyTextField
                label="Confirm Password"
                name="confirmPassword"
                control={control}
                placeholder="Confirm your password"
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
                  background: "linear-gradient(135deg, #0c2340 0%, #0e4f6e 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0e7490 0%, #0891b2 100%)"
                  }
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </Stack>
          </form>
          
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <MuiLink component={Link} to="/login" sx={{ fontWeight: 600 }}>
                Sign in here
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;