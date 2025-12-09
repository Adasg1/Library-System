# Dokumentacja Library-System

## Użyte Technologie
* Java
* Spring

## Model bazodanowy
![database](./Library-database.png)

## Model obiektowy
![UML](./Library-UML.png)

### User
Klasa przedstawiająca użytkowników biblioteki, w tym bibliotekarzy i adminów

### Role
Enumerator dostępnych ról użytkowników

### Category
Przedstawia kategorie, rodzaje i gatunki książek dostępnych w bibliotece

### Book
Przedstawia książki dostępne w bibliotece, ich tytuły, autorów oraz inne informacje istotne dla czytelników

### BookCopy
Przedstawia indywidualne egzemplarze książek, które biblioteka ma w magazynie oraz ich stan

### BookStatus
Enumerator - stan egzemplarza książki

### Loan
Klasa przedstawia pożyczkę książki przez danego użytkownika, jej daty pożyczenia oraz oddania jak również jej status. Historia wypożyczeń jest przechowywana do celów archiwalnych

### LoanStatus
Enumerator - status pożyczki

### Reservation
Przedstawia rezerwacje książek. Rezerwacje mogą być użyte gdy użytkownik chce pożyczyć książki które na ten moment nie są dostępne

### ReservationStatus
Enumerator - status rezerwacji

## Operacje CRUD dla użytkownika

### Dodawanie nowego użytkownika

<img width="2771" height="1208" alt="image" src="https://github.com/user-attachments/assets/276a3497-9cc2-4b1b-92c0-b160a5ee898b" />

<img width="2773" height="665" alt="image" src="https://github.com/user-attachments/assets/5decf3f4-d3dd-4c0a-b3be-99b666488f1c" />

### Pobieranie listy użytkowników

<img width="3514" height="574" alt="image" src="https://github.com/user-attachments/assets/b6673280-f0a4-49da-907d-0955b20f96d0" />

<img width="3404" height="1239" alt="image" src="https://github.com/user-attachments/assets/63b5df40-f9d2-48ab-a498-54deadfde228" />

### Pobieranie pojedynczego użytkownika

<img width="3504" height="805" alt="image" src="https://github.com/user-attachments/assets/ecf3a3ab-41bd-461c-b51c-f95daa253f65" />

<img width="3434" height="858" alt="image" src="https://github.com/user-attachments/assets/6480de8b-c819-4594-bc32-81f6fc11aa57" />

### Edytowanie danych uzytkownika

<img width="2772" height="1405" alt="image" src="https://github.com/user-attachments/assets/ba66e299-f1c5-41d7-90e4-c83c0fd3c93d" />

<img width="2760" height="658" alt="image" src="https://github.com/user-attachments/assets/3f0f2352-8e62-4e27-9bff-1bd8da7c7f86" />

### Usuwanie użytkownika

<img width="2767" height="649" alt="image" src="https://github.com/user-attachments/assets/04a60218-1328-43dd-ac69-0009d8957f2f" />

<img width="2756" height="171" alt="image" src="https://github.com/user-attachments/assets/783e2b1e-a60d-403a-a306-2aa820c25073" />

### Rejestracja użytkownika

<img width="2761" height="1189" alt="image" src="https://github.com/user-attachments/assets/38ff5305-11a9-48f7-87f4-6b1605af01aa" />

<img width="2767" height="417" alt="image" src="https://github.com/user-attachments/assets/deeb7e97-2c97-4bbe-8387-2c779f2053b6" />

### Logowanie użytkownika

<img width="2774" height="1211" alt="image" src="https://github.com/user-attachments/assets/48e0b983-5e7f-4fdd-86ce-2cd6899a3d28" />

<img width="2760" height="410" alt="image" src="https://github.com/user-attachments/assets/edf2cc41-0662-46ec-a1b7-3cd06b2aa534" />

## Wygląd i działanie aplikacji

### Strona główna

<img width="898" height="603" alt="image" src="https://github.com/user-attachments/assets/e7be1724-7643-46fa-9d38-d8b10c65628f" />

### Strona logowania

<img width="945" height="639" alt="image" src="https://github.com/user-attachments/assets/01569982-0987-4187-9485-66fd70094d5f" />

### Strona rejestracji

<img width="1163" height="604" alt="image" src="https://github.com/user-attachments/assets/1a630765-2446-4828-b70e-beff78f6ac6a" />

### Strona główna po poprawnym zalogowaniu

<img width="850" height="657" alt="image" src="https://github.com/user-attachments/assets/4b4c3e92-8bbb-4ce0-bf5b-f365db86dfd5" />

### Strona profilu użytkownika

<img width="856" height="566" alt="image" src="https://github.com/user-attachments/assets/bf0ec032-686f-47a0-954a-a80435ece9d8" />





