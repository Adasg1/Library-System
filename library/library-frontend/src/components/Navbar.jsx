import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
            <Toolbar sx={{ px: 3 }}>
                {/* Logo */}
                <MenuBookIcon sx={{ display: 'flex', mr: 1, color: '#646cff' }} />
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        mr: 2,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        flexGrow: 1,
                    }}
                >
                    MOLE KSIĄŻKOWE
                </Typography>

                {/* Menu z prawej strony */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                    <Button component={Link} to="/books" sx={{ color: '#ddd' }}>
                        Katalog
                    </Button>

                    {user ? (
                        // Widok zalogowanego użytkownika
                        <>
                            <Button component={Link} to="/profile" sx={{ color: '#ddd' }}>
                                Mój Profil
                            </Button>

                            <Typography sx={{ color: '#646cff', display: { xs: 'none', sm: 'block' }, mx: 2 }}>
                                {user.email}
                                {/* można dodać np. user.firstname, ale admin nie posiada, więc na razie do testów jest email */}
                            </Typography>

                            <Button
                                onClick={handleLogout}
                                variant="outlined"
                                sx={{ color: 'white', borderColor: '#555' }}
                            >
                                Wyloguj
                            </Button>
                        </>
                    ) : (
                        // Widok niezalogowanego użytkownika
                        <>
                            <Button component={Link} to="/login" sx={{ color: 'white' }}>
                                Logowanie
                            </Button>
                            <Button component={Link} to="/register" variant="contained" sx={{ backgroundColor: '#646cff' }}>
                                Rejestracja
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
export default Navbar;