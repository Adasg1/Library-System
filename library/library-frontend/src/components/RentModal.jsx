import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Box,
    CircularProgress,
    Autocomplete,
    TextField
} from '@mui/material';
import { Close, BookmarkAdd, Search } from '@mui/icons-material';
import { toast } from "react-toastify";
import { userService } from "../services/userService";
import { loanService } from "../services/loanService";

const RentBookModal = ({ open, onClose, copyId, onRentSuccess }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            loadUsers();
            setSelectedUser(null);
        }
    }, [open]);

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            toast.error("Nie udało się pobrać listy czytelników.");
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleRentSubmit = async () => {
        if (!selectedUser) {
            toast.warn("Wybierz użytkownika z listy!");
            return;
        }

        setSubmitting(true);
        try {
            // Tutaj wyciągamy ID z obiektu
            await loanService.rentBook(selectedUser.id, copyId);
            toast.success(`Pomyślnie wypożyczono egzemplarz #${copyId}`);

            onRentSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Błąd wypożyczania. Sprawdź blokady użytkownika.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                    Wypożycz egzemplarz #{copyId}
                </Typography>
                <IconButton onClick={onClose} aria-label="close">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box py={2}>
                    {loadingUsers ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Autocomplete
                            id="user-select-autocomplete"
                            options={users}
                            getOptionLabel={(option) =>
                                `${option.firstName} ${option.lastName} (${option.email})`
                            }
                            value={selectedUser}
                            onChange={(event, newValue) => {
                                setSelectedUser(newValue);
                            }}
                            renderOption={(props, option) => {
                                const { key, ...otherProps } = props;
                                return (
                                    <li key={key} {...otherProps}>
                                        <Box>
                                            <Typography variant="body1" fontWeight={500}>
                                                {option.firstName} {option.lastName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.email} • {option.role}
                                            </Typography>
                                        </Box>
                                    </li>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Wyszukaj czytelnika"
                                    placeholder="Wpisz imię, nazwisko lub email..."
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <Search color="action" sx={{ mr: 1 }} />
                                                {params.InputProps.startAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                            noOptionsText="Nie znaleziono użytkownika"
                            fullWidth
                        />
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit" disabled={submitting}>
                    Anuluj
                </Button>
                <Button
                    onClick={handleRentSubmit}
                    variant="contained"
                    color="primary"
                    startIcon={<BookmarkAdd />}
                    disabled={submitting || loadingUsers || !selectedUser}
                >
                    {submitting ? "Przetwarzanie..." : "Zatwierdź"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RentBookModal;