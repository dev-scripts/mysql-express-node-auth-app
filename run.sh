#!/bin/bash

if [ "$1" == "start" ]; then
    docker compose up -d
elif [ "$1" == "bash" ]; then
docker exec -it mysql-express-node-auth-app-app-1 bash
elif [ "$1" == "stop" ]; then
 docker compose down
elif [ "$1" == "env" ]; then
 cp .env.example .env
else
    echo "Invalid input. Use 'start' to run docker compose up or 'bash' to exec into the container."
    exit 1
fi
