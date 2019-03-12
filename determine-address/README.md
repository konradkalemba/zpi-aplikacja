# determine-address

Moduł wyłapujący lokalizację z opisu ogłoszenia.

## Instalacja

```bash
npm install
```

## Development

Kompilacja:
```bash
npm run tsc
```

### Połączenie z bazą danych

Dane do połączenia z bazą danych pobierane są ze zmiennych środowiskowych.

Przykładowy plik `.env`:
```bash
DB_HOST="localhost"
DB_USER="postgres"
DB_PASS="12345"
DB_NAME="zpi"
DB_CA_FILE="./ca.crt" #opcjonalnie
```