import React, {useState} from 'react';
import {useNavigate, Link} from "react-router";
import {useAuth} from "../context/AuthContext.jsx";
import { Container, TextField, Button, Typography, Paper, Alert, Box } from '@mui/material';

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // pobieram funkcję register z Contextu
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        setError("");

        // walidacja uzupełnienia wszystkich pól
        if(!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        if (!validateEmail(formData.email)) {
            setError("Wprowadź poprawny adres e-mail.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Hasło musi mieć co najmniej 8 znaków.");
            return;
        }

        try {
            const result = await register(formData);

            if(result.success) {
                setError("");
                navigate("/");
            } else {
                setError(result.error || "Błąd rejestracji");
            }
        } catch (err){
            setError("Rejestracja się nie powiodła. Spróbuj ponownie.");
            console.error(err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={paperStyles}>
                <Typography variant="h5" mb={3}>
                    Rejestracja
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Imię"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    sx={textFieldStyles}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Nazwisko"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    sx={textFieldStyles}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Adres email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={textFieldStyles}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Hasło"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={textFieldStyles}
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, bgcolor: '#646cff', '&:hover': { bgcolor: '#535bf2' } }}
                    onClick={handleRegister}
                >
                    Zarejestruj się
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

// styles (te same co w LoginPage)
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

export default RegisterPage;