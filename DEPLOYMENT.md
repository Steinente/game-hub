# Game Hub mit Docker Hub und Portainer veröffentlichen

Die GitHub Action testet und baut den Game Hub und veröffentlicht anschließend
ein Multi-Arch-Image für `linux/amd64` und `linux/arm64` unter
`steinente/game-hub`. Die Compose-Datei lädt dieses fertige Image; Portainer
muss den Quellcode daher nicht selbst bauen.

## 1. Docker-Hub-Repository und GitHub-Secrets

1. Lege auf Docker Hub das öffentliche Repository `steinente/game-hub` an.
2. Erzeuge unter **Account settings → Personal access tokens** ein Token mit
   Lese- und Schreibzugriff.
3. Öffne im GitHub-Repository
   **Settings → Secrets and variables → Actions**.
4. Lege diese Repository-Secrets an:
   - `DOCKERHUB_USERNAME`: `steinente`
   - `DOCKERHUB_TOKEN`: das Docker-Hub-Token

Verwende nicht dein Docker-Hub-Passwort als Secret.

## 2. Image veröffentlichen

Ein Push auf `master` startet den Workflow automatisch, sofern sich eine für
Build oder Container relevante Datei geändert hat. Alternativ kann er unter
**Actions → Build and publish Docker image → Run workflow** manuell gestartet
werden.

Veröffentlicht werden:

- `steinente/game-hub:latest` für den aktuellen Stand von `master`
- `steinente/game-hub:sha-...` als unveränderlicher Commit-Tag
- bei Git-Tags wie `v1.2.0` zusätzlich `1.2.0` und `1.2`

## 3. Stack in Portainer anlegen

1. Öffne **Stacks → Add stack** und vergib den Namen `game-hub`.
2. Wähle **Git repository**.
3. Trage die öffentliche HTTPS-URL des GitHub-Repositories ein.
4. Verwende als Repository-Referenz `refs/heads/master`.
5. Trage als Compose-Pfad `docker-compose.yml` ein.
6. Lege optional Environment-Variablen fest:
   - `GAME_HUB_PORT`: veröffentlichter Host-Port, standardmäßig `4000`
   - `GAME_HUB_TAG`: Image-Tag, standardmäßig `latest`
7. Klicke auf **Deploy the stack**.

Der Game Hub ist anschließend standardmäßig unter
`http://SERVER-IP:4000` erreichbar.

## 4. Neue Version ausrollen

1. Pushe Änderungen auf `master` und warte auf den erfolgreichen Workflow.
2. Wähle in Portainer **Pull and redeploy** beziehungsweise
   **Update the stack**.
3. Aktiviere **Re-pull image**, damit das neue Image geladen wird.

Die Compose-Datei verwendet zusätzlich `pull_policy: always`. Automatische
Aktualisierungen lassen sich in Portainer über GitOps-Updates oder einen
Stack-Webhook einrichten.

Der Container läuft ohne Root-Rechte und stellt intern Port `4000` bereit.
Docker und Portainer prüfen seinen Zustand über `/health`.
