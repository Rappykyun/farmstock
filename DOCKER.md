# Docker Setup

This project can run in Docker with:

- `app`: Laravel + Apache + built Vite assets
- `db`: MySQL 8.4
- `queue`: optional worker for database/Redis-backed queues

## 1. Create the Docker env file

```bash
cp .env.docker.example .env.docker
```

Set at least:

- `APP_KEY`
- `APP_URL`
- `DB_PASSWORD`

The Docker stack expects:

- `DB_CONNECTION=mysql`
- `DB_HOST=db`
- `DB_PORT=3306`

Generate an app key without installing PHP on the host:

```bash
docker run --rm php:8.3-cli php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```

Paste that value into `APP_KEY` in `.env.docker`.

## 2. Build and start the app

```bash
docker compose --env-file .env.docker up -d --build
```

The app will be available on `http://localhost:8080` by default, or on whatever port you set in `APP_PORT` inside `.env.docker`.

## 3. Run database migrations

```bash
docker compose --env-file .env.docker exec app php artisan migrate --force
```

## 4. Optional queue worker

The Docker env defaults to `QUEUE_CONNECTION=sync` for the simplest setup.

If you want a real worker:

1. Set `QUEUE_CONNECTION=database` in `.env.docker`
2. Make sure the jobs tables exist by running the migrations
3. Start the worker profile

```bash
docker compose --env-file .env.docker --profile worker up -d
```

## Common commands

```bash
docker compose --env-file .env.docker logs -f app
docker compose --env-file .env.docker exec app php artisan optimize
docker compose --env-file .env.docker exec app php artisan migrate:status
docker compose --env-file .env.docker down
```
