# VM Deployment

This project is set up to deploy to a single Ubuntu VM using:

- Docker Compose for the Laravel app and PostgreSQL
- Host-level Nginx as the reverse proxy
- GitHub Actions for deployment over SSH

## 1. DNS

Create an `A` record for your subdomain that points to your VM's public IPv4 address.

Example:

- Hostname: `farmstock`
- Type: `A`
- Value: `203.0.113.10`

That maps `farmstock.example.com` to your VM.

## 2. Prepare the VM

Install the required packages:

```bash
sudo apt update
sudo apt install -y nginx rsync git
```

Docker should already be installed. If not, install it first.

Create the app directory:

```bash
sudo mkdir -p /opt/farmstock
sudo chown -R "$USER":"$USER" /opt/farmstock
```

Clone the repo once so the example deployment files exist on the VM:

```bash
git clone <your-repo-url> /opt/farmstock
```

## 3. Create the runtime env on the VM

On the VM:

```bash
cd /opt/farmstock
cp .env.docker.example .env.docker
```

Use values like:

```env
COMPOSE_PROJECT_NAME=farmstock
APP_BIND=127.0.0.1
APP_PORT=8080

APP_NAME=Farmstock
APP_ENV=production
APP_KEY=base64:replace-this-with-your-real-key
APP_DEBUG=false
APP_URL=https://farmstock.example.com

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=farmstock
DB_USERNAME=farmstock
DB_PASSWORD=replace-this-with-a-strong-password

SESSION_DRIVER=file
QUEUE_CONNECTION=sync
CACHE_STORE=file
```

`APP_BIND=127.0.0.1` keeps the container private so only Nginx on the VM can reach it.

## 4. Configure Nginx

Copy the sample config:

```bash
sudo cp deploy/nginx/farmstock.conf.example /etc/nginx/sites-available/farmstock
```

Edit it:

- replace `app.example.com` with your real subdomain
- if you changed `APP_PORT`, also change `proxy_pass`

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/farmstock /etc/nginx/sites-enabled/farmstock
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Enable HTTPS

After the DNS record points to the VM and Nginx is serving HTTP, use Certbot for Nginx:

```bash
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d farmstock.example.com
```

## 6. Configure GitHub Actions secrets

Add these repository or environment secrets in GitHub:

- `SSH_HOST`: your VM public IP or DNS name
- `SSH_PORT`: usually `22`
- `SSH_USER`: the deploy user on the VM
- `SSH_PRIVATE_KEY`: the private key matching the VM authorized key
- `DEPLOY_PATH`: `/opt/farmstock`

## 7. First deploy

Push to `master` or manually run the workflow.

The workflow:

1. checks out the repo
2. syncs the files to `/opt/farmstock`
3. runs `bash deploy/vm-deploy.sh /opt/farmstock` on the VM
4. builds and starts the Docker stack
5. runs Laravel migrations

## 8. Useful VM commands

```bash
cd /opt/farmstock
docker compose --env-file .env.docker ps
docker compose --env-file .env.docker logs -f app
docker compose --env-file .env.docker logs -f db
docker compose --env-file .env.docker exec app php artisan about
```

## Notes

- This workflow builds on the VM. That is simpler, but heavier on a 2 GB droplet.
- A stronger next step is building the image in GitHub Actions, pushing it to a registry, and letting the VM only pull and restart.
- If you host multiple apps on the same VM, keep each app on its own port and give each one its own Nginx server block.
