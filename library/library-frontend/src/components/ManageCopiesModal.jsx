import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Stack,
    Box,
    Tooltip,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Close,
    AddCircleOutline,
    Delete,
    Settings,
    BookmarkAdd,
    AssignmentReturn,
    Search // Ikona lupy
} from '@mui/icons-material';
import { toast } from "react-toastify";
import { bookCopyService } from "../services/bookCopyService.js";
import { loanService } from "../services/loanService.js";

const ManageCopiesModal = ({
                               open,
                               onClose,
                               bookId,
                               copies,
                               onRefresh,
                               onRentClick
                           }) => {

    const [searchId, setSearchId] = useState("");

    const getStatusConfig = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return { color: 'success', label: 'Dostępna' };
            case 'LOANED':
                return { color: 'error', label: 'Wypożyczona' };
            case 'RESERVED':
                return { color: 'warning', label: 'Zarezerwowana' };
            default:
                return { color: 'default', label: status };
        }
    };

    const handleAddCopy = async () => {
        try {
            await bookCopyService.addCopy(bookId, "AVAILABLE");
            toast.success("Dodano nowy egzemplarz!");
            onRefresh();
        } catch (error) {
            toast.error("Błąd podczas dodawania egzemplarza.");
        }
    };

    const handleDeleteCopy = async (copyId) => {
        if(!window.confirm("Czy na pewno usunąć ten egzemplarz?")) return;
        try {
            await bookCopyService.deleteCopy(copyId);
            toast.info("Usunięto egzemplarz.");
            onRefresh();
        } catch (error) {
            toast.error("Nie można usunąć egzemplarza (być może jest wypożyczony).");
        }
    };

    const handleReturnCopy = async (copyId) => {
        if (!window.confirm("Czy na pewno chcesz zwrócić ten egzemplarz")) return;
        try {
            await loanService.returnBookByCopyId(copyId);
            toast.info("Zwrócono egzemplarz.");
            onRefresh();
        } catch (error) {
            toast.error("Nie udało się zwrócić egzemplarza");
        }
    }

    const filteredCopies = copies.filter((copy) =>
        copy.id.toString().includes(searchId)
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            {/* --- NAGŁÓWEK --- */}
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc' }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Settings color="action" />
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        Zarządzanie Egzemplarzami
                    </Typography>
                </Box>
                <IconButton onClick={onClose} aria-label="close">
                    <Close />
                </IconButton>
            </DialogTitle>

            {/* --- TREŚĆ --- */}
            <DialogContent dividers sx={{ p: 3 }}>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                    gap={2}
                >
                    <Typography variant="body1" color="text.secondary">
                        Łącznie egzemplarzy: <strong>{copies.length}</strong>
                    </Typography>

                    <Stack direction="row" gap={2} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Szukaj ID..."
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: '180px' }}
                        />

                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddCircleOutline />}
                            onClick={handleAddCopy}
                            sx={{ textTransform: 'none', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                        >
                            Dodaj egzemplarz
                        </Button>
                    </Stack>
                </Stack>

                {/* Tabela */}
                {copies.length === 0 ? (
                    <Box
                        p={4}
                        textAlign="center"
                        border="2px dashed #e0e0e0"
                        borderRadius={2}
                        bgcolor="#fafafa"
                    >
                        <Typography color="text.secondary">Brak egzemplarzy w systemie.</Typography>
                    </Box>
                ) : filteredCopies.length === 0 ? (
                    <Box
                        p={4}
                        textAlign="center"
                        border="1px solid #eee"
                        borderRadius={2}
                        bgcolor="#fff"
                    >
                        <Typography color="text.secondary">
                            Nie znaleziono egzemplarza o ID zawierającym "<strong>{searchId}</strong>".
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Akcje</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCopies.map((copy) => {
                                    const statusConfig = getStatusConfig(copy.status);
                                    const isAvailable = copy.status === 'AVAILABLE';
                                    const canRent = isAvailable || copy.status === 'RESERVED';
                                    const canReturn = copy.status === 'LOANED';

                                    return (
                                        <TableRow key={copy.id} hover>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                #{copy.id}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={statusConfig.label}
                                                    color={statusConfig.color}
                                                    size="small"
                                                    variant="filled"
                                                    sx={{ fontWeight: 600, minWidth: 100 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                                    {/* Przycisk WYPOŻYCZ */}
                                                    {canRent && (
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<BookmarkAdd />}
                                                            onClick={() => onRentClick(copy.id)}
                                                            sx={{
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                minWidth: '120px'
                                                            }}
                                                        >
                                                            Wypożycz
                                                        </Button>
                                                    )}

                                                    {/* Przycisk ZWRÓĆ */}
                                                    {canReturn && (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="warning"
                                                            startIcon={<AssignmentReturn />}
                                                            onClick={() => handleReturnCopy(copy.id)}
                                                            sx={{
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                minWidth: '120px',
                                                                borderColor: '#ed6c02',
                                                                color: '#e65100',
                                                                '&:hover': {
                                                                    borderColor: '#e65100',
                                                                    backgroundColor: 'rgba(237, 108, 2, 0.04)'
                                                                }
                                                            }}
                                                        >
                                                            Zwróć
                                                        </Button>
                                                    )}

                                                    {/* Przycisk USUŃ */}
                                                    <Tooltip title={!isAvailable ? "Nie można usunąć aktywnej kopii" : "Usuń egzemplarz"}>
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDeleteCopy(copy.id)}
                                                                disabled={!isAvailable}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Zamknij</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ManageCopiesModal;