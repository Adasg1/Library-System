import React, { useState } from 'react';
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { Container, TextField, Button, Typography, Paper, Alert, Box } from '@mui/material';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const validateForm = () => {
        if (!email || !password) {
            setError("Wszystkie pola są wymagane.");
            return false;
        }

        if (!validateEmail(email)) {
            setError("Wprowadź poprawny adres e-mail.");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        setError("");

        if(!validateForm()) return;

        try{
            const result = await login(email, password);
            if (result.success) {
                navigate("/");
            } else {
                setError(result.msg || "Błąd logowania.");
            }
        } catch(err) {
            setError("Błąd połączenia z serwerem.");
        }
    }

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={paperStyles}>
                <Typography variant="h5" mb={3}>
                    Logowanie
                </Typography>

                {error && (<Alert severity="error">{error}</Alert>)}

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Adres Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={textFieldStyles}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Hasło"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={textFieldStyles}
                />

                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor: '#646cff', '&:hover': { bgcolor: '#535bf2' } }} onClick={handleLogin}>
                    Zaloguj się
                </Button>

                <Link to="/">
                    <Button fullWidth variant="text" sx={{ color: '#aaa' }}>
                        Powrót do strony głównej
                    </Button>
                </Link>
            </Paper>
        </Container>
    );
};

// style
const paperStyles = {
    mt: 8,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    color: 'white',
};

const textFieldStyles = {
    input: { color: 'white' },
    label: { color: '#aaa' },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#555' }
    }
};

export default LoginPage;