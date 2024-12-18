# Prepair

## ngrok

Reverse proxy for Spotify callback

```bash
# install on macOS
brew install ngrok/ngrok/ngrok

# install on Linux
curl -s https://ngrok-agent.s3.amazonaws.com/install.sh | sh

# development on macOS or production server
ngrok config add-authtoken <your-ngrok-token>
ngrok http --domain=<your-ngrok-domain>.ngrok-free.app 4000
```

## Spotify Developer Settings

- https://developer.spotify.com/dashboard/applications
- Create an app, get Client ID and Client Secret
- Edit App Settings - Basic Information - Redirect URIs:
  - `https://<your-ngrok-domain>.ngrok-free.app/api/auth/callback` (development or production)
- Edit App Settings - User Management - Add user

## Ticketmaster Developer Settings

- https://developer.ticketmaster.com/products-and-docs/apis/getting-started/
- Create an app, get API key

## MongoDB Atlas

- https://cloud.mongodb.com
- Create a cluster, get connection string

## Environment Settings Files

- Development
  - `backend/.env.development`
  - `frontend/.env.development`
- Production
  - `backend/.env`
  - `frontend/.env`

# Development Locally

- Install dependencies

```bash
# backend
cd backend
npm install

# frontend
cd frontend
npm install
```

- Run locally

```bash
# set environment
export NODE_ENV=development

# backend
npm run start

# frontend
npm run dev
```

# Demo

https://concert-finder.jackluo.me
