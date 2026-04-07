# Farmstock

This project is set up for a traditional local Laravel environment.

## Local setup

1. Install PHP 8.3+, Composer, Node.js, npm, and MySQL.
2. Copy the environment file:

```bash
cp .env.example .env
```

3. Update the database credentials in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=farmstock
DB_USERNAME=root
DB_PASSWORD=
```

4. Install dependencies and generate the app key:

```bash
composer install
npm install
php artisan key:generate
```

5. Run migrations:

```bash
php artisan migrate
```

6. Start the app locally:

```bash
composer dev
```

There is no Docker or VM deployment configuration in this repository anymore.
