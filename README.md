# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite) for details on supported features.

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

Deploy info:
 - This app builds a docker image of remix, seeding the env variable to docker env from .env.production
 - The database is a sqlite that defaults to directory /home/roman/db/sqlite --> This directory must exist, create it manually
 - On deploy the script mounts /home/roman/db/sqlite on a docker volume to persist the data , checks if the directory has a db file and if not it creates one
 - The app is hosted in localhost:3000

How to deploy:
 - You need a .env.production file 
        NODE_ENV=production
        DATABASE_URL="file:/usr/src/app/data/prod.db"
        PROCESS_TASKS_SECRET=xxx
        SESSION_SECRET=xxx
 - If you are missing the databse, you will need to create a .env file with the following content
        DATABASE_URL="file:/home/roman/db/sqlite/prod.db"
    - Run the following commands
        npx prisma db push
 - docker compose down -v  # Kill the running containers and remove the volumes
 - docker compose build # Builds the image
 - docker compose up -d # Starts the containers in detached mode

Cron Job
    - THe server must run a cronJob to process the tasks, every monday at 00:00
        0 0 * * 1 curl -X GET "http://localhost:3000/process_tasks?secret=xxxx"
