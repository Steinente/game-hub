# Game Hub

Angular-SSR-Projekt für einen Spiel-Hub mit PWA-Unterstützung.

## Voraussetzungen

- Docker Desktop (inkl. Docker Compose)

## Start mit Docker Compose

1. Im Projektordner starten:

```bash
docker compose up --build
```

2. App im Browser öffnen:

```text
http://localhost:4000
```

Die Compose-Konfiguration führt im Container automatisch aus:

- `npm ci`
- `npm run build`
- `npm run serve:ssr:game-hub`

## Wichtige Docker-Befehle

Container stoppen:

```bash
docker compose down
```

Logs anzeigen:

```bash
docker compose logs -f
```

Komplett neu aufsetzen (inkl. Node-Module-Volume):

```bash
docker compose down -v
docker compose up --build
```

## Lokale Entwicklung ohne Docker

```bash
npm install
npm start
```

Dann unter `http://localhost:4200` testen.

## Tests

```bash
npm test
```
