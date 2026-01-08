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

Dostępne dla: `ADMIN`

**`POST` /api/user/add**  
```json
{
    "firstName": "Jan",
    "lastName": "Kowalski",
    "email": "jan.kowalski@gmail.com",
    "password": "hasło",
    "role": "LIBRARIAN"
}
```

**Zwraca:**
```json
{
  "id": 2,
  "firstName": "Jan",
  "lastName": "Kowalski",
  "email": "jan.kowalski@gmail.com",
  "role": "LIBRARIAN"
}
```

**Możliwe błędy:**

//TODO
> `403 - Forbidden` gdy istnieje już użytkownik o podanym adresie email  


### Pobieranie listy użytkowników

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`GET` /api/user**  

**Zwraca:**
```json
[
  {
    "id": 2,
    "firstName": "Jan",
    "lastName": "Kowalski",
    "email": "jan.kowalski@gmail.com",
    "role": "LIBRARIAN"
  },
  {
    "id": 3,
    "firstName": "Grzegorz",
    "lastName": "Brzęczyszczykiewicz",
    "email": "grzegorz1997@gmail.com",
    "role": "READER"
  }
]
```


### Pobieranie pojedynczego użytkownika

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`GET` /api/user/{id}**  


**Zwraca:** *(tu dla id=3)*
```json
{
  "id": 3,
  "firstName": "Grzegorz",
  "lastName": "Brzęczyszczykiewicz",
  "email": "grzegorz1997@gmail.com",
  "role": "READER"
}
```

**Możliwe błędy:**

> `404 - Not Found` gdy nie istnieje użytkownik o podanym id

### Edytowanie danych uzytkownika

Dostępne dla: `ADMIN`

**`PUT` /api/user/{id}**  
```json
{
    "firstName": "Janusz",
    "lastName": "Nowak",
    "email": "nowak.janusz@wp.pl",
    "password": "nowe hasło",
    "role": "READER"
}
```

> [!NOTE]  
> Można wysłać tylko te pola które chce się zmienić

**Zwraca:** *(tu dla id=2)*
```json
{
  "id": 2,
  "firstName": "Janusz",
  "lastName": "Nowak",
  "email": "nowak.janusz@wp.pl",
  "role": "READER"
}
```

**Możliwe błędy:**

> `404 - Not Found` gdy nie istnieje użytkownik o podanym id  

//TODO  
> `403 - Forbidden` gdy istnieje już użytkownik o podanym adresie email  

### Usuwanie użytkownika

Dostępne dla: `ADMIN`

**`DELETE` /api/user/{id}**  

**Możliwe błędy:**

> `404 - Not Found` gdy użytkownik o podanym id nie istnieje

### Rejestracja użytkownika

Dostępne dla: `Brak ograniczeń`

**`POST` /api/auth/register**  
```json
{
    "firstName": "Jan",
    "lastName": "Kowalski",
    "email": "jan.kowalski@gmail.com",
    "password": "hasło masło"
}
```

**Zwraca:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUkVBREVSIiwiaWQiOjcsInN1YiI6Imphbi5rb3dhbHNraUBnbWFpbC5jb20iLCJpYXQiOjE3Njc4NzUwMTQsImV4cCI6MTc2Nzk2MTQxNH0.MsAqyA-1h6DkTLQhKIyBpeu4hU4g7TZYdjw1FU9XT60",
  "email": "jan.kowalski@gmail.com",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "role": "READER"
}
```

**Możliwe błędy:**

//TODO

### Logowanie użytkownika

Dostępne dla: `Brak ograniczeń`

**`POST` /api/auth/login**  
```json
{
    "email": "jan.kowalski@gmail.com",
    "password": "hasło masło"
}
```

**Zwraca:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUkVBREVSIiwiaWQiOjcsInN1YiI6Imphbi5rb3dhbHNraUBnbWFpbC5jb20iLCJpYXQiOjE3Njc4NzUwMTQsImV4cCI6MTc2Nzk2MTQxNH0.MsAqyA-1h6DkTLQhKIyBpeu4hU4g7TZYdjw1FU9XT60",
  "email": "jan.kowalski@gmail.com",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "role": "READER"
}
```

**Możliwe błędy:**

//TODO


## Operacje CRUD dla książek


### Dodawanie nowej kategorii

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`POST` /api/category/add**  
```json
{
    "categoryName": "nazwa kategorii"
}
```

**Zwraca:**
```json
{
  "categoryId": 68,
  "categoryName": "nazwa kategorii"
}
```

**Możliwe błędy:**

> `409 - Category by that name already exists` gdy istnieje już kategoria o podanej nazwie  


### Zmienianie nazwy kategorii

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`PUT` /api/category/{id}** 
```json
{
    "categoryName": "nowa nazwa kategorii"
}
```

**Zwraca:** *(tu dla id = 68)*
```json
{
  "categoryId": 68,
  "categoryName": "nowa nazwa kategorii"
}
```

**Możliwe błędy:**

> `409 - Category by that name already exists` gdy istnieje już kategoria o podanej nazwie

> `404 - Not Found` gdy kategoria o podanym id nie istnieje


### Pobieranie listy kategorii

Dostępne dla: `Brak ograniczeń`

**`GET` /api/category**  

**Zwraca:**
```json
[
  {
    "categoryId": 112,
    "categoryName": "action"
  },
  {
    "categoryId": 113,
    "categoryName": "adventure"
  },
  {
    "categoryId": 106,
    "categoryName": "comedy"
  },
  {
    "categoryId": 68,
    "categoryName": "nowa nazwa kategorii"
  }
]
```


### Pobieranie jednej kategorii

Dostępne dla: `Brak ograniczeń`

**`GET` /api/category/{id}**  

**Zwraca:** *(tu dla id = 68)*
```json
{
  "categoryId": 68,
  "categoryName": "nowa nazwa kategorii"
}
```

**Możliwe błędy:**

> `404 - Not Found` gdy kategoria o podanym id nie istnieje


### Usuwanie kategorii

Dostępne dla: `ADMIN`

**`DELETE` /api/category/{id}**  

**Możliwe błędy:**

> `404 - Not Found` gdy kategoria o podanym id nie istnieje


### Dodawanie nowej książki

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`POST` /api/book/add**  
```json
{
  "title": "Tytuł Książki",
  "isbn": "83-8257-131-X",
  "author": "Autor książki",
  "description": "Opis książki, może być długi",
  "publisher": "Wydawca",
  "publishYear": 2026,
  "categoryNames": [
    "action",
    "adventure"
  ]
}
```

**Zwraca:**
```json
{
  "bookId": 1,
  "title": "Tytuł Książki",
  "isbn": "83-8257-131-X",
  "author": "Autor książki",
  "description": "Opis książki, może być długi",
  "publisher": "Wydawca",
  "publishYear": 2026,
  "categoryNames": [
    "adventure",
    "action"
  ]
}
```

**Możliwe błędy:**

> `400 - The ISBN number is not valid` gdy suma kontrolna numeru ISBN nie jest poprawna, system akceptuje 10 i 13-cyfrowe numery ISBN przedzielone myślnikami

> `409 - Book with this ISBN already exists` gdy w bazie jest już książka o danym numerze ISBN

> `404 - Category 'NAME' not found` gdy jedna z podanych kategorii nie istnieje


### Zmiana danych książki

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`PUT` /api/book/{id}**  
```json
{
  "title": "Nowy Tytuł Książki",
  "isbn": "83-964925-9-X",
  "author": "Nowy autor książki",
  "description": "Nowy opis książki, może być długi",
  "publisher": "Nowy Wydawca",
  "publishYear": 2027,
  "categoryNames": []
}
```

> [!NOTE]  
> Można (w przypadku ISBN nawet trzeba) wysłać tylko te pola które chce się zmienić

**Zwraca:** *(dla id = 102)*
```json
{
  "bookId": 102,
  "title": "Nowy Tytuł Książki",
  "isbn": "83-964925-9-X",
  "author": "Nowy autor książki",
  "description": "Nowy opis książki, może być długi",
  "publisher": "Nowy Wydawca",
  "publishYear": 2027,
  "categoryNames": []
}
```

**Możliwe błędy:**

> `404 - Book by that id not found` gdy książka o podanym id nie istnieje

> `400 - The ISBN number is not valid` gdy suma kontrolna numeru ISBN nie jest poprawna, system akceptuje 10 i 13-cyfrowe numery ISBN przedzielone myślnikami

> `409 - Book with this ISBN already exists` gdy w bazie jest już książka o danym numerze ISBN

> `404 - Category 'NAME' not found` gdy jedna z podanych kategorii nie istnieje


### Pobieranie listy książek (pełny opis)

Dostępne dla: `Brak ograniczeń`

**`GET` /api/book/full**  

**Zwraca:**
```json
[
  {
    "bookId": 1,
    "title": "Tytuł Książki",
    "isbn": "83-8257-131-X",
    "author": "Autor książki",
    "description": "Opis książki, może być długi",
    "publisher": "Wydawca",
    "publishYear": 2026,
    "categoryNames": [
      "action",
      "adventure"
    ]
  }
]
```

### Pobieranie listy książek (tylko tytuł i autor)

Dostępne dla: `Brak ograniczeń`

**`GET` /api/book/brief**  

**Zwraca:**
```json
[
  {
    "bookId": 1,
    "title": "Tytuł Książki",
    "author": "Autor książki"
  }
]
```

### Pobieranie jednej książki (pełny opis)

Dostępne dla: `Brak ograniczeń`

**`GET` /api/book/full/{id}**  

**Zwraca:** *(tu dla id = 1)*
```json
{
  "bookId": 1,
  "title": "Tytuł Książki",
  "isbn": "83-8257-131-X",
  "author": "Autor książki",
  "description": "Opis książki, może być długi",
  "publisher": "Wydawca",
  "publishYear": 2026,
  "categoryNames": [
    "action",
    "adventure"
  ]
}
```

**Możliwe błędy:**

> `404 - Not Found` gdy książka o podanym id nie istnieje


### Pobieranie jednej książki (tylko tytuł i autor)

Dostępne dla: `Brak ograniczeń`

**`GET` /api/book/brief/{id}**  

**Zwraca:** *(tu dla id = 1)*
```json
{
  "bookId": 1,
  "title": "Tytuł Książki",
  "author": "Autor książki"
}
```

**Możliwe błędy:**

> `404 - Not Found` gdy książka o podanym id nie istnieje

### Usuwanie książki

Dostępne dla: `ADMIN`

**`DELETE` /api/book/{id}**  

**Możliwe błędy:**

> `404 - Not Found` gdy książka o podanym id nie istnieje

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





