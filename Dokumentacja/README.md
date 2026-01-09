# Dokumentacja Library-System

## Użyte Technologie
* Java 25
* Spring Boot
* Gradle
* React
* Axios
* Postgres
* Docker
* Docker Compose

## Infrastruktura i Baza Danych
Aplikacja wykorzystuje bazę danych PostgreSQL do trwałego przechowywania danych. Całe środowisko bazodanowe jest w pełni kontenerowe:

Docker: Służy do izolacji bazy danych od systemu operacyjnego.

Docker Compose: Zarządza kontenerem bazy danych, definiując zmienne środowiskowe (hasła, użytkowników), porty oraz wolumeny (persystencja danych po restarcie kontenera).

Integracja: Spring Boot łączy się z bazą za pomocą sterownika JDBC, korzystając z konfiguracji zawartej w pliku application.properties / yml.

## Architektura i wzorce projektowe
Domain-Driven Design (DDD): Projekt wykorzystuje podejście Domain-Driven Design (DDD). System jest podzielony na logiczne domeny (User, Book, Loan, Reservation), z których każda stanowi spójny moduł.

Separacja warstw: Aplikacja podzielona jest na warstwy: Controller (API), Service (Logika biznesowa) oraz Repository (Dostęp do danych).

DTO (Data Transfer Objects): System wykorzystuje wzorzec DTO do komunikacji z frontendem. Dzięki temu encje bazodanowe nie są bezpośrednio wystawiane na zewnątrz, co zwiększa bezpieczeństwo i zapobiega problemom z cyklicznymi zależnościami. Pozwala również na wstępną walidację

Business Logic: Cała logika, taka jak walidacja numerów ISBN, sprawdzanie dostępności egzemplarzy, znajduje się w warstwie serwisowej.

## Bezpieczeństwo
Spring Security: Zabezpiecza endpointy przed nieautoryzowanym dostępem.

JWT (JSON Web Token): Autoryzacja odbywa się za pomocą tokenów JWT. Po zalogowaniu użytkownik otrzymuje token, który jest dodawany w nagłówku Authorization: Bearer <token> przy każdym zapytaniu do chronionych zasobów.

RBAC (Role-Based Access Control): Dostęp do konkretnych operacji (np. dodawanie książek, usuwanie użytkowników) jest ograniczony na poziomie ról (ADMIN, LIBRARIAN, READER).

## Model bazodanowy
![database](./Library-database.png)

## Model obiektowy
![UML](./Library-UML.png)

### User
* `int` userId  
* `String` firstName
* `String` lastName
* `String` email
* `String` password
* `Role` role  
* `List<Loan>` loans
* `List<Reservation>` reservations

Klasa przedstawiająca użytkowników biblioteki, w tym bibliotekarzy i adminów

### Role
* `ADMIN`
* `LIBRARIAN`
* `READER`

Enumerator dostępnych ról użytkowników

### Category
* `int` categoryId
* `String` categoryName
* `List<Book>` books

Przedstawia kategorie, rodzaje i gatunki książek dostępnych w bibliotece

### Book
* `int` bookId  
* `String` title
* `String` isbn
* `String` author
* `String` description
* `String` publisher
* `int` publishYear
* `Set<Category>` categories
* `List<BookCopy>` bookCopies
* `List<Reservation>` reservations

Przedstawia książki dostępne w bibliotece, ich tytuły, autorów oraz inne informacje istotne dla czytelników

### BookCopy
* `int` bookCopyId
* `Book` book
* `BookStatus` status

Przedstawia indywidualne egzemplarze książek, które biblioteka ma w magazynie oraz ich stan

### BookStatus
* `AVAILABLE`
* `DAMAGED`
* `LOST`
* `LOANED`
* `RESERVED`

Enumerator - stan egzemplarza książki

### Loan
* `int` loanId
* `User` user
* `BookCopy` bookCopy
* `LoanStatus` status
* `LocalDateTime` rentalDate
* `LocalDateTime` dueDate
* `LocalDateTime` returnDate

Klasa przedstawia pożyczkę książki przez danego użytkownika, jej daty pożyczenia oraz oddania jak również jej status. Historia wypożyczeń jest przechowywana do celów archiwalnych

### LoanStatus
* `ACTIVE`
* `RETURNED`
* `OVERDUE`

Enumerator - status pożyczki

### Reservation
* `int` reservationId
* `LocalDateTime` reservationDate
* `LocalDateTime` maxPickupDate
* `ReservationStatus` status
* `User` user
* `Book` book
* `BookCopy` assignedCopy

Przedstawia rezerwacje książek. Rezerwacje mogą być użyte gdy użytkownik chce pożyczyć książki które na ten moment nie są dostępne

### ReservationStatus
* `WAITING`
* `READY`
* `COMPLETED`
* `CANCELED`

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
    "password": "haslo12345",
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

> `403 - Forbidden` gdy coś jest nie tak


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

> `403 - Forbidden` gdy coś jest nie tak

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
    "password": "haslo12345"
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

> `403 - Forbidden` gdy coś jest nie tak

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

> `403 - Forbidden` gdy coś jest nie tak


### Pobranie swoich danych

Dostępne dla: `Zalogowany Użytkownik`

**`POST` /api/user/me**  

**Zwraca:**
```json
{
  "id": 2,
  "firstName": "Janusz",
  "lastName": "Nowak",
  "email": "nowak.janusz@wp.pl",
  "role": "READER"
}
```



## Operacje CRUD dla kategorii


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



## Operacje CRUD dla książek


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



### Operacje CRUD dla kopii książek

### Dodawanie nowej kopii książki

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`POST` /api/bookcopy/add/{id}?status={status}**

**Zwraca:** *(tu dla id=1 i status=AVAILABLE)*
```json
{
  "id": 1,
  "bookId": 1,
  "title": "Tytuł Książki",
  "status": "AVAILABLE"
}
```


### Dodawanie wielu nowych kopii książki

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`POST` /api/bookcopy/add/{id}?status={status}&amount={amount}**

**Zwraca:** *(tu dla id=1, status=AVAILABLE i amount=2)*
```json
[
  {
    "id": 2,
    "bookId": 1,
    "title": "Tytuł Książki",
    "status": "AVAILABLE"
  },
  {
    "id": 3,
    "bookId": 1,
    "title": "Tytuł Książki",
    "status": "AVAILABLE"
  }
]
```


### Pobieranie wszystkich kopii książek

Dostępne dla: `Brak ograniczeń`

**`GET` /api/bookcopy**

**Zwraca:**
```json
[
  {
    "id": 1,
    "bookId": 1,
    "title": "Tytuł Książki",
    "status": "AVAILABLE"
  },
  {
    "id": 2,
    "bookId": 1,
    "title": "Tytuł Książki",
    "status": "AVAILABLE"
  },
  {
    "id": 3,
    "bookId": 2,
    "title": "Inny Tytuł Książki",
    "status": "AVAILABLE"
  }
]
```


### Pobieranie wszystkich kopii danej książki

Dostępne dla: `Brak ograniczeń`

**`GET` /api/bookcopy/book/{id}**

**Zwraca:** *(tu dla id=1)*
```json
[
  {
    "id": 1,
    "bookId": 1,
    "title": "Tytuł Książki",
    "status": "AVAILABLE"
  },
  {
    "id": 2,
    "bookId": 1,
    "title": "Tytuł Książki",
    "status": "AVAILABLE"
  }
]
```


### Pobieranie jednej kopii książki

Dostępne dla: `Brak ograniczeń`

**`GET` /api/bookcopy/{id}**

**Zwraca:** *(tu dla id=1)*
```json
{
  "id": 1,
  "bookId": 1,
  "title": "Tytuł Książki",
  "status": "AVAILABLE"
}
```

### Aktualizacja statusu książki

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`POST` /api/bookcopy/{id}/status?status={status}**

**Zwraca:** *(tu dla id=1 i status=DAMAGED)*
```json
{
  "id": 1,
  "bookId": 1,
  "title": "Tytuł Książki",
  "status": "DAMAGED"
}
```

### Usuwanie kopii książki

Dostępne dla: `ADMIN`

**`DELETE` /api/bookcopy/{id}**  



## Operacje CRUD dla wypożyczeń


### Wypożyczenie książki użytkownikowi

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`POST` /api/loan/rent?userId={userId}&copyId={copyId}**

**Zwraca:** *(tu dla userId=2 i copyId=2)*
```json
{
  "loanId": 1,
  "userId": 2,
  "userEmail": "jan.kowalski@gmail.com",
  "bookCopyId": 2,
  "bookTitle": "Tytuł Książki",
  "status": "ACTIVE",
  "rentalDate": "2026-01-09T08:39:48.372451538",
  "dueDate": "2026-02-08T08:39:48.372504871",
  "returnDate": null
}
```


### Zwrot książki

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`POST` /api/loan/return/{id}**

**Zwraca:** *(tu dla id=1)*
```json
{
  "loanId": 1,
  "userId": 2,
  "userEmail": "jan.kowasdfsdsf@gmail.com",
  "bookCopyId": 2,
  "bookTitle": "Tytuł Książki",
  "status": "RETURNED",
  "rentalDate": "2026-01-09T08:39:48.372452",
  "dueDate": "2026-02-08T08:39:48.372505",
  "returnDate": "2026-01-09T08:42:52.917809157"
}
```


### Pobranie danego wypożyczenia

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`GET` /api/loan/{id}**

**Zwraca:** *(tu dla id=1)*
```json
{
  "loanId": 1,
  "userId": 2,
  "userEmail": "jan.kowasdfsdsf@gmail.com",
  "bookCopyId": 2,
  "bookTitle": "Tytuł Książki",
  "status": "RETURNED",
  "rentalDate": "2026-01-09T08:39:48.372452",
  "dueDate": "2026-02-08T08:39:48.372505",
  "returnDate": "2026-01-09T08:42:52.917809157"
}
```


### Pobranie wszystkich wypożyczeń

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`GET` /api/loan**

**Zwraca:**
```json
[
  {
    "loanId": 1,
    "userId": 2,
    "userEmail": "jan.kowasdfsdsf@gmail.com",
    "bookCopyId": 2,
    "bookTitle": "Tytuł Książki",
    "status": "RETURNED",
    "rentalDate": "2026-01-09T08:39:48.372452",
    "dueDate": "2026-02-08T08:39:48.372505",
    "returnDate": "2026-01-09T08:42:52.917809"
  },
  {
    "loanId": 2,
    "userId": 1,
    "userEmail": "grzegorz1987@fred.net",
    "bookCopyId": 3,
    "bookTitle": "Tytuł Książki",
    "status": "ACTIVE",
    "rentalDate": "2026-01-09T08:46:59.63366",
    "dueDate": "2026-02-08T08:46:59.633697",
    "returnDate": null
  }
]
```

### Pobranie wypożyczeń danego użytkownika

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`GET` /api/loan/user/{id}**

**Zwraca:** *(tu dla id=2)*
```json
[
  {
    "loanId": 1,
    "userId": 2,
    "userEmail": "jan.kowasdfsdsf@gmail.com",
    "bookCopyId": 2,
    "bookTitle": "Tytuł Książki",
    "status": "RETURNED",
    "rentalDate": "2026-01-09T08:39:48.372452",
    "dueDate": "2026-02-08T08:39:48.372505",
    "returnDate": "2026-01-09T08:42:52.917809157"
  }
]
```

### Pobranie swoich wypożyczeń

Dostępne dla: `Zalogowany Użytkownik`

**`GET` /api/loan/me**

**Zwraca:**
```json
[
  {
    "loanId": 2,
    "userId": 1,
    "userEmail": "grzegorz1987@fred.net",
    "bookCopyId": 3,
    "bookTitle": "Tytuł Książki",
    "status": "ACTIVE",
    "rentalDate": "2026-01-09T08:46:59.63366",
    "dueDate": "2026-02-08T08:46:59.633697",
    "returnDate": null
  }
]
```



## Operacje CRUD dla Rezerwacji


### Złożenie rezerwacji

Dostępne dla: `Zalogowany Użytkownik`

**`POST` /api/reservation**  
```json
{
  "bookId": 1
}
```

**Zwraca:**
```json
{
  "reservationId": 1,
  "reservationDate": "2026-01-09T09:08:09.84551806",
  "maxPickupDate": "2026-01-12T09:08:09.854376967",
  "status": "READY",
  "bookTitle": "Tytuł Książki"
}
```

### Anulowanie rezerwacji

Dostępne dla: `Zalogowany Użytkownik`

**`PATCH` /api/reservation/{id}**  

**Zwraca:** *(tu dla id=1)*
```json
{
  "reservationId": 1,
  "reservationDate": "2026-01-09T09:08:09.845518",
  "maxPickupDate": "2026-01-12T09:08:09.854377",
  "status": "CANCELED",
  "bookTitle": "Tytuł Książki"
}
```


### Pobranie rezerwacji użytkownika

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`GET` /api/reservation/user/{id}**  

**Zwraca:** *(tu dla id=1)*
```json
[
  {
    "reservationId": 1,
    "reservationDate": "2026-01-09T09:08:09.845518",
    "maxPickupDate": "2026-01-12T09:08:09.854377",
    "status": "CANCELED",
    "bookTitle": "Tytuł Książki"
  }
]
```

### Pobranie rezerwacji książki

Dostępne dla: `ADMIN`, `LIBRARIAN`

**`GET` /api/reservation/book/{id}**  

**Zwraca:** *(tu dla id=1)*
```json
[
  {
    "reservationId": 1,
    "reservationDate": "2026-01-09T09:08:09.845518",
    "maxPickupDate": "2026-01-12T09:08:09.854377",
    "status": "CANCELED",
    "bookTitle": "Tytuł Książki"
  }
]
```


### Pobranie swoich rezerwacji

Dostępne dla: `Zalogowany Użytkownik`

**`GET` /api/reservation/me**  

**Zwraca:**
```json
[
  {
    "reservationId": 1,
    "reservationDate": "2026-01-09T09:08:09.845518",
    "maxPickupDate": "2026-01-12T09:08:09.854377",
    "status": "CANCELED",
    "bookTitle": "Tytuł Książki"
  }
]
```



## Wygląd i działanie aplikacji (milestone M1)

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

# Frontend - opis (M2)

## Użyte Technologie i Biblioteki
* **React (Vite)** – szkielet aplikacji.
* **React Router** – obsługa routingu i nawigacji między podstronami.
* **Axios** – klient HTTP do komunikacji z backendem (obsługa requestów i tokenów).
* **Tailwind CSS** – stylowanie aplikacji (utility-first CSS).
* **Material UI (MUI)** – gotowe komponenty interfejsu (ikony, pola formularzy, przyciski).
* **React Toastify** – wyświetlanie powiadomień dla użytkownika.
* **Context API** – zarządzanie stanem globalnym (autoryzacja).

## Struktura Projektu
* **`/pages`** – główne widoki (podstrony) aplikacji.
* **`/components`** – komponenty wielokrotnego użytku (np. Navbar, Karta Książki).
* **`/services`** – logika biznesowa i komunikacja z API.
* **`/context`** – konteksty Reacta (zarządzanie stanem zalogowanego użytkownika).
* **`/assets`** – pliki statyczne.

## Autoryzacja i Bezpieczeństwo (`AuthContext`)

System autoryzacji oparty jest o **JWT (JSON Web Token)**.
Za zarządzanie sesją odpowiada `AuthContext.jsx`.

1.  **Logowanie:** Token otrzymany z backendu jest zapisywany w `localStorage`.
2.  **Persystencja:** Przy odświeżeniu strony aplikacja sprawdza obecność tokena i automatycznie przywraca dane użytkownika.
3.  **Wylogowanie:** Usuwa token i czyści stan użytkownika.
4.  **Ochrona tras (`ProtectedRoute.jsx`):** Specjalny komponent-wrapper, który sprawdza, czy użytkownik jest zalogowany. Jeśli nie – przekierowuje do logowania. Obsługuje również sprawdzanie ról (np. dostęp do panelu admina tylko dla `ADMIN`).

## Warstwa Komunikacji (`/services`)

Komunikacja z API odbywa się poprzez skonfigurowaną instancję Axios w pliku `api.js`.

* **Interceptors:** Każde zapytanie wychodzące z aplikacji jest automatycznie przechwytywane, a do nagłówka dodawany jest token: `Authorization: Bearer {token}`.
* **Serwisy:** Logika została podzielona na tematyczne pliki:
    * `authService` – logowanie, rejestracja, pobieranie danych profilu.
    * `bookService` – pobieranie książek (full/brief), filtrowanie, CRUD książek.
    * `bookCopyService` – zarządzanie egzemplarzami (dodawanie kopii, zmiana statusu).
    * `loanService` – wypożyczanie, zwroty, historia wypożyczeń.
    * `reservationService` – rezerwowanie książek, anulowanie rezerwacji.
    * `userService` – zarządzanie użytkownikami (panel admina).
    * `categoryService` – pobieranie i zarządzanie kategoriami.

## Routing i Widoki

Aplikacja posiada zdefiniowane następujące ścieżki w `App.jsx`:

### Dostępne publicznie:
* `/` – **HomePage**: Strona główna. Dla gości wyświetla zachętę do logowania, dla zalogowanych – dashboard z kaflami.
* `/login` – **LoginPage**: Formularz logowania.
* `/register` – **RegisterPage**: Formularz rejestracji nowego czytelnika.

### Dostępne dla zalogowanych (READER, LIBRARIAN, ADMIN):
* `/books` – **BookListPage**: Katalog książek. Zawiera sidebar z filtrowaniem po kategoriach oraz grid z kartami książek (`BookCard`).
* `/books/details/:id` – **BookDetailsPage**: Szczegóły książki.
    * Wyświetla opis, autora, wydawnictwo.
    * Tabela egzemplarzy ze statusami.
    * Możliwość rezerwacji (jeśli brak wolnych kopii).
* `/profile` – **ProfilePage**: Panel użytkownika.
    * Wyświetla dane osobowe.
    * Tabela aktualnych wypożyczeń.
    * Tabela rezerwacji (z opcją anulowania).

### Panel Administracyjny i Obsługa (LIBRARIAN, ADMIN):
* `/books/new` – **BookFormPage**: Formularz dodawania nowej książki (wraz z dynamicznym dodawaniem kategorii).
* `/books/update/:id` – **BookFormPage**: Ten sam formularz w trybie edycji (pobiera dane istniejącej książki).
* **Zarządzanie egzemplarzami** (wewnątrz `BookDetailsPage`):
    * Dodawanie nowych kopii.
    * Usuwanie kopii.
    * Wypożyczanie egzemplarza konkretnemu użytkownikowi (Modal z wyborem użytkownika).

### Tylko Administrator (ADMIN):
* `/admin/users` – **AdminPage**: Tabela wszystkich użytkowników.
    * Usuwanie użytkowników.
    * Zmiana ról (np. awansowanie Czytelnika na Bibliotekarza).

## Zmiany w Milestone 2 (M2) vs M1

Wersja M1 skupiała się na fundamencie autoryzacji i profilu użytkownika. Wersja M2 wprowadza pełną logikę biznesową biblioteki.

### Kluczowe nowości w M2:
1.  **Katalog Książek (`BookListPage`):**
    * Zastąpiono statyczne widoki dynamiczną siatką książek pobieranych z API.
    * Dodano **Panel Kategorii** (Sidebar) umożliwiający filtrowanie księgozbioru.
2.  **Szczegóły i Logika Wypożyczeń (`BookDetailsPage`):**
    * Dodano widok pojedynczej książki.
    * Zaimplementowano tabelę egzemplarzy (`BookCopy`) ze statusami (Dostępna, Wypożyczona, Zniszczona).
    * Dodano logikę przycisku **"Wypożycz"** (dla Admina) i **"Rezerwuj"** (dla Użytkownika).
3.  **Panel Administracyjny (`AdminPage` + `BookFormPage`):**
    * **Zarządzanie Użytkownikami:** Tabela z możliwością usuwania użytkowników i edycji ich ról (np. awans na Bibliotekarza).
    * **CRUD Książek:** Formularze do dodawania i edycji książek (wraz z dynamicznym przypisywaniem kategorii).
4.  **Rozbudowa Profilu:**
    * Sekcja "Moje Wypożyczenia" i "Moje Rezerwacje" jest teraz w pełni funkcjonalna i pobiera dane użytkownika.
5.  **Bezpieczeństwo:**
    * Rozbudowano `ProtectedRoute` o sprawdzanie konkretnych ról (np. dostęp do `/admin` tylko dla roli `ADMIN`).

## Instrukcja uruchomienia Frontendu

Aby uruchomić aplikację kliencką lokalnie:

1.  **Wymagania:**
    * Node.js (wersja 16 lub nowsza).
    * NPM (domyślnie z Node.js).

2.  **Instalacja zależności:**
    Otwórz terminal w folderze projektu (tam gdzie plik `package.json`) i wpisz:
    ```bash
    npm install
    ```

3.  **Uruchomienie w trybie deweloperskim:**
    ```bash
    npm run dev
    ```
    Aplikacja zazwyczaj uruchomi się pod adresem: `http://localhost:5173`.

4.  **Konfiguracja:**
    Upewnij się, że backend (Java Spring) działa na porcie `8080`, ponieważ frontend jest skonfigurowany do łączenia się z `http://localhost:8080/api`.

## Wygląd i działanie aplikacji (milestone M2)

### Pełna lista podstron (Routing)

**1. Strefa Publiczna (Dostępna dla każdego)**
* `/` – **Strona Główna (HomePage) (reader)**
    * Dla niezalogowanych: Landing page z zachętą do logowania.
    ![alt text](image.png)
    * Dla zalogowanych: Dashboard nawigacyjny.
    ![alt text](image-1.png)
  * `/` – **Strona Główna (HomePage) (admin)**
    * Dla zalogowanych: Dashboard nawigacyjny.
    ![alt text](image-2.png)
* `/login` – **Logowanie (LoginPage)**
    * Formularz logowania do systemu.
    ![alt text](image-3.png)
* `/register` – **Rejestracja (RegisterPage)**
    * Formularz zakładania nowego konta czytelnika.
    ![alt text](image-4.png)

**2. Strefa Użytkownika (Dostępna dla: READER, LIBRARIAN, ADMIN)**
* `/books` – **Katalog Książek (BookListPage) (reader)** 
    * Lista wszystkich dostępnych książek z filtrowaniem po kategoriach.
    ![alt text](image-5.png)

* `/books/details/:id` – **Szczegóły Książki (BookDetailsPage) (reader)** 
    * Widok pojedynczej książki (opis, autor, wydawnictwo).
    * Tabela egzemplarzy (dostępność).
    * Akcje: Rezerwacja (Reader) lub Wypożyczenie (Librarian/Admin).
    ![alt text](image-6.png)

* `/profile` – **Profil Użytkownika (ProfilePage) (reader)**
    * Dane osobowe zalogowanego użytkownika.
    * Historia wypożyczeń (aktywne i zwrócone).
    * Lista aktualnych rezerwacji.
    ![alt text](image-7.png)

* `/books` – **Katalog Książek (BookListPage) (admin)** 
    * Lista wszystkich dostępnych książek z filtrowaniem po kategoriach.
    ![alt text](image-8.png)

* `/books/details/:id` – **Szczegóły Książki (BookDetailsPage) (admin)** 
    * Widok pojedynczej książki (opis, autor, wydawnictwo).
    * Tabela egzemplarzy (dostępność).
    * Akcje: Rezerwacja (Reader) lub Wypożyczenie (Librarian/Admin).
    ![alt text](image-9.png)

* `/profile` – **Profil Użytkownika (ProfilePage) (admin)**
    * Dane osobowe zalogowanego użytkownika.
    * Historia wypożyczeń (aktywne i zwrócone).
    * Lista aktualnych rezerwacji.
    ![alt text](image-10.png)

**3. Strefa Bibliotekarza (Dostępna dla: LIBRARIAN, ADMIN)**
* `/books/new` – **Dodawanie Książki (BookFormPage)**
    * Formularz tworzenia nowej pozycji w bazie danych.
    ![alt text](image-11.png)
* `/books/update/:id` – **Edycja Książki (BookFormPage)**
    * Ten sam formularz w trybie edycji (pola wypełnione danymi edytowanej książki).
    ![alt text](image-12.png)

**4. Strefa Administratora (Dostępna dla: ADMIN)**
* `/admin/users` – **Zarządzanie Użytkownikami (AdminPage)**
    * Tabela wszystkich użytkowników w systemie.
    * Akcje: Usuwanie kont, edycja ról (nadawanie uprawnień).
    ![alt text](image-13.png)
