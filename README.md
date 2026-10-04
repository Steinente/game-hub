# Game Hub

Angular-SSR-Projekt für einen Spiel-Hub mit PWA-Unterstützung.

## Voraussetzungen

- Docker Desktop (inkl. Docker Compose)

## Docker Hub und Portainer

Das öffentliche Produktionsimage wird als `steinente/game-hub:latest`
veröffentlicht. Die vollständige Einrichtung von Docker Hub, GitHub Actions
und Portainer ist in [DEPLOYMENT.md](DEPLOYMENT.md) beschrieben.

## Start mit Docker Compose

1. Im Projektordner starten:

```bash
docker compose up -d
```

2. App im Browser öffnen:

```text
http://localhost:4000
```

Die Compose-Konfiguration lädt standardmäßig das fertige Image
`steinente/game-hub:latest` aus Docker Hub. Mit `GAME_HUB_TAG` kann ein
anderer Image-Tag und mit `GAME_HUB_PORT` ein anderer Host-Port gewählt
werden.

## Wichtige Docker-Befehle

Container stoppen:

```bash
docker compose down
```

Logs anzeigen:

```bash
docker compose logs -f
```

Aktuelles Image laden und Container neu erstellen:

```bash
docker compose pull
docker compose up -d
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
