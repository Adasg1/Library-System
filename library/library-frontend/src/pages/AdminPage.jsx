import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Select, MenuItem, Typography, Alert } from '@mui/material';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (err) {
            setError("Nie udało się pobrać listy użytkowników.");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userService.updateUser(userId, { role: newRole });
            loadUsers();
        } catch (err) {
            alert("Błąd zmiany roli: " + err.message);
        }
    };

    const handleDelete = async (userId) => {
        if(!window.confirm("Na pewno usunąć użytkownika?")) return;
        try {
            await userService.deleteUser(userId);
            loadUsers();
        } catch (err) {
            alert("Nie można usunąć użytkownika (może mieć aktywne wypożyczenia).");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, color: 'white' }}>
                Zarządzanie użytkownikami
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={paperStyles}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerCell}>ID</TableCell>
                            <TableCell sx={headerCell}>Email</TableCell>
                            <TableCell sx={headerCell}>Imię i nazwisko</TableCell>
                            <TableCell sx={headerCell}>Rola</TableCell>
                            <TableCell sx={headerCell}>Akcje</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map(user => {
                            const userId = user.id ?? user.userId;

                            return (
                                <TableRow key={userId}>
                                    <TableCell sx={bodyCell}>{userId}</TableCell>
                                    <TableCell sx={bodyCell}>
                                        {user.email || user.username}
                                    </TableCell>
                                    <TableCell sx={bodyCell}>
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            size="small"
                                            value={user.role}
                                            onChange={e => handleRoleChange(userId, e.target.value)}
                                            sx={selectStyles}
                                        >
                                            <MenuItem value="READER">Czytelnik</MenuItem>
                                            <MenuItem value="LIBRARIAN">Bibliotekarz</MenuItem>
                                            <MenuItem value="ADMIN">Admin</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            color="error"
                                            onClick={() => handleDelete(userId)}
                                        >
                                            Usuń
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

// style
const paperStyles = {
    width: '100%',
    overflow: 'hidden',
    bgcolor: '#333',
    color: 'white',
};

const headerCell = {
    color: '#aaa',
    fontWeight: 'bold',
};

const bodyCell = {
    color: 'white',
};

const selectStyles = {
    color: 'white',
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: '#555',
    },
};

export default AdminPage;