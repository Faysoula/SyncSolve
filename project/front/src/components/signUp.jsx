import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  EmailOutlined,
  LockOutlined
} from '@mui/icons-material';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom theme with your updated color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#E0B1CB',
    },
    background: {
      default: '#231942',
      paper: '#5E548E',
    },
    text: {
      primary: '#FAF0CA',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '1rem',
          textTransform: 'none',
          fontWeight: 600,
          color: '#231942',
          backgroundColor: '#E0B1CB',
          '&:hover': {
            backgroundColor: '#BE95C4',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#9F86C0',
            color: '#FAF0CA',
            '& fieldset': {
              borderColor: '#BE95C4',
            },
            '&:hover fieldset': {
              borderColor: '#E0B1CB',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#FAF0CA',
          },
          '& .MuiSvgIcon-root': {
            color: '#FAF0CA',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#5E548E',
          borderRadius: '16px',
          padding: '24px',
        },
      },
    },
  },
});

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data } = await api.post('/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.firstName,
        last_name: formData.lastName,
      });
      
      localStorage.setItem('token', data.token);
      setShowSuccess(true);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
      });
      
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const renderTextField = (name, label, type = 'text', icon) => (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        value={formData[name]}
        onChange={handleChange}
        error={!!errors[name]}
        helperText={errors[name]}
        sx={{
          '& .MuiOutlinedInput-root': {
            paddingLeft: '14px',
          },
        }}
        InputProps={{
          startAdornment: (
            <Box component="span" sx={{ mr: 1, display: 'flex' }}>
              {icon}
            </Box>
          ),
          ...(type === 'password' && {
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: '#FAF0CA' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }),
        }}
      />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#231942',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={8} sx={{ p: 4, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: '#FAF0CA',
                mb: 1,
              }}
            >
              Create Account
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#FAF0CA',
                opacity: 0.8,
                mb: 4,
              }}
            >
              Join us and start your coding journey
            </Typography>

            {apiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {apiError}
              </Alert>
            )}

            {showSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Registration successful! Welcome aboard!
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ width: '100%' }}
                >
                  {renderTextField('firstName', 'First Name', 'text', <PersonOutline />)}
                  {renderTextField('lastName', 'Last Name', 'text', <PersonOutline />)}
                </Stack>

                {renderTextField('username', 'Username', 'text', <PersonOutline />)}
                {renderTextField('email', 'Email', 'email', <EmailOutlined />)}
                {renderTextField('password', 'Password', 'password', <LockOutlined />)}
                {renderTextField('confirmPassword', 'Confirm Password', 'password', <LockOutlined />)}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    backgroundColor: '#E0B1CB',
                    '&:hover': {
                      backgroundColor: '#BE95C4',
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SignupForm;