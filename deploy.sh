#!/bin/bash

# Configuration
EC2_HOST="13.127.89.209"
EC2_USER="ubuntu"
KEY_PATH="./OptiPath.pem" # Path to your PEM key

if [ ! -f "$KEY_PATH" ]; then
    echo "Error: PEM key not found at $KEY_PATH. Please place your .pem file in the root directory and rename it to key.pem or update the script."
    exit 1
fi

echo "Deploying to $EC2_HOST..."

ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST << 'EOF'
    # Commands to run on the server
    
    # 1. Update & Install Dependencies (First time only, commands are safe to re-run)
    # sudo apt-get update
    # sudo apt-get install -y nodejs npm git

    # 2. Setup/Pull Repo
    if [ ! -d "algo-viz-pro" ]; then
        echo "Cloning repository..."
        git clone https://github.com/Satvik-Parihar/OptiPath.git
    fi

    cd algo-viz-pro
    echo "Pulling latest changes..."
    git pull origin main

    # 3. Install & Build
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    echo "Installing frontend dependencies & building..."
    cd frontend && npm install && npm run build && cd ..

    # 4. Restart PM2
    echo "Restarting application..."
    npm install -g pm2
    pm2 restart ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
    pm2 save
    
    echo "Deployment Complete!"
EOF
