#!/bin/bash

# Configuration variables
IMAGE_NAME="ppv-frontend-app"
CONTAINER_NAME="ppv-frontend-app-container"
PORT_MAPPING="3000:3000"
ENV_FILE=".env"
LOG_FILE="deploy.log"

# Redirect output to log file
exec > >(tee -a "$LOG_FILE") 2>&1

echo "---------------------------------"
echo "🚀 Starting deployment: $(date)"
echo "---------------------------------"

# Step 1: Build the new Docker image
echo "🔨 Building the Docker image: $IMAGE_NAME ..."
docker build --no-cache -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed. Check logs for details."
    exit 1
fi
echo "✅ Build completed successfully."

# Step 2: Stop and remove the old container if it exists
if docker ps -q -f name=$CONTAINER_NAME; then
    echo "🛑 Stopping existing container: $CONTAINER_NAME ..."
    docker stop $CONTAINER_NAME
fi

if docker ps -aq -f name=$CONTAINER_NAME; then
    echo "🗑 Removing old container: $CONTAINER_NAME ..."
    docker rm $CONTAINER_NAME
fi

# Step 3: Remove unused images (optional, but helps free space)
echo "🧹 Cleaning up old images..."
docker image prune -f

# Step 4: Run the new container
echo "🚢 Starting new container: $CONTAINER_NAME ..."
docker run -d -p $PORT_MAPPING --env-file $ENV_FILE --name $CONTAINER_NAME $IMAGE_NAME

# Step 5: Wait for the container to be healthy
echo "⏳ Waiting for container health check..."
sleep 5

if ! docker ps -q -f name=$CONTAINER_NAME; then
    echo "❌ Deployment failed! Container did not start correctly."
    exit 1
fi

# Display logs
echo "📜 Fetching logs from container..."
docker logs -f --tail=20 $CONTAINER_NAME

echo "🎉 Deployment complete! 🚀"
