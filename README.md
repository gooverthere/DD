# Aplikacja Lista Posiłków

Prosta aplikacja do zarządzania listą posiłków z możliwością dodawania nowych pozycji przez popup z formularzem.

---

## Technologie

- Vue 3 (Composition API)
- Backend API (np. Node.js / Express)
- Docker & Docker Compose do uruchomienia środowiska

---

## Struktura projektu

```
frontend/        # aplikacja Vue
backend/         # serwer Express (API)
docker-compose.yml
```

---

## Uruchomienie lokalnie przy użyciu Docker Compose

1. **Klonowanie repozytorium**

   ```bash
   git clone https://github.com/gooverthere/DD.git
   cd DD
   ```

2. **Budowanie i uruchomienie**

   ```bash
   docker-compose up --build
   ```

3. **Dostęp do aplikacji**

   - Frontend:  `http://localhost:3000`
   - Backend API: `http://localhost:8000`

4. **Zatrzymanie i usunięcie kontenerów**

   ```bash
   docker-compose down
   ```
   W celu wyczyszczenia bazy danych użyj

   ```bash
   docker-compose down -v
   ```

---