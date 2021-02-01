 #!/bin/bash

 # exports env vars from local env file for access
export $(grep -v '#.*' .env | xargs)

# pass exported env vars as build args to docker build. Args are then passed the env vars in docker file.
docker build --build-arg PORT=$PORT --build-arg CORS_ORIGIN=$CORS_ORIGIN --build-arg IP=$IP -t blockchain-network-v01 .    

docker run -p 80:80 blockchain-network-v01 