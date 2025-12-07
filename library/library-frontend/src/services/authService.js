// import api from "./api"; // ZAKOMENTOWANE, BO NIE UŻYWAMY PRAWIDŁOWEGO API

// Symulowane dane użytkownika, które będą używane w testach
const MOCKED_USER = {
    id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@biblioteka.pl",
    // Dodajemy rolę, aby przetestować przyszłą autoryzację M1
    role: "ADMIN"
};

export const authService = {
    // --- MOCKOWANIE LOGOWANIA ---
    async login(email, password) {
        // Symulujemy opóźnienie sieciowe, żeby zobaczyć "Ładowanie..."
        await new Promise(resolve => setTimeout(resolve, 500));

        if (email === MOCKED_USER.email && password === "Haslo123") {
            // Logowanie pomyślne
            const token = "mock-jwt-token-123";
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(MOCKED_USER));

            return { token: token, user: MOCKED_USER };
        } else if (email === "error@error.pl") {
            // Symulacja błędu z backendu
            throw { response: { data: { message: "Nieprawidłowy e-mail lub hasło." } } };
        } else {
            // Symulacja ogólnego błędu
            throw new Error("Wystąpił nieznany błąd podczas logowania.");
        }
    },
    // --- MOCKOWANIE REJESTRACJI ---
    async register(userData) {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (userData.email === MOCKED_USER.email) {
            // Symulacja błędu: użytkownik już istnieje
            throw { response: { data: { message: "Użytkownik o tym adresie e-mail już istnieje." } } };
        }

        // Symulacja udanej rejestracji (nie zwracamy tokenu, rejestracja kończy się przekierowaniem na /login)
        return { message: "Rejestracja pomyślna" };
    },

    // --- WYLOGOWANIE POZOSTAJE BEZ ZMIAN ---
    logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
};

// Uwaga: Pamiętaj, aby przywrócić oryginalne importy i funkcje, gdy backend będzie gotowy!