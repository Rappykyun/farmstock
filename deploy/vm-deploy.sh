#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-$(pwd)}"

cd "$APP_DIR"

if [ ! -f .env.docker ]; then
    echo ".env.docker is missing in $APP_DIR" >&2
    exit 1
fi

docker compose --env-file .env.docker up -d --build
docker compose --env-file .env.docker exec -T app php artisan migrate --force
