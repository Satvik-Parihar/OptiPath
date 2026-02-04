# OptiPath - Algorithm Visualizer

**OptiPath** is a premium algorithm visualization tool designed for users to intuitively understand complex graph algorithms like Dijkstra's Algorithm and Floyd-Warshall.

![OptiPath](frontend/public/optipath-logo.png)

## 🚀 Features

*   **Interactive Graph Editor**: Create nodes and edges visually.
*   **Image Import**: Upload an image of a graph, and our AI will attempt to reconstruct it.
*   **Step-by-Step Visualization**: Watch the algorithm execute in real-time with detailed step counters and state matrices.
*   **Theory & Comparison**: Learn the underlying concepts and compare algorithm efficiency.
*   **Responsive Design**: A beautiful, human-centric interface that works seamlessly on modern devices.
*   **No Database Needed**: Runs purely in-memory for instant feedback.

## 🛠️ Technology Stack

*   **Frontend**: React.js, Vite, Framer Motion, Cytoscape.js
*   **Backend**: Node.js, Express.js
*   **Deployment**: AWS EC2, PM2, Nginx (Optional)

## 📦 Installation & Setup

### Prerequisites

*   Node.js (v18 or higher)
*   npm

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Satvik-Parihar/OptiPath.git
    cd algo-viz-pro
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd ../backend
    npm install
    ```

4.  **Run Locally:**
    You can run both servers concurrently or in separate terminals.

    *Terminal 1 (Backend):*
    ```bash
    cd backend
    npm run dev
    ```

    *Terminal 2 (Frontend):*
    ```bash
    cd frontend
    npm run dev
    ```

    Open your browser at `http://localhost:5173`.

## ☁️ Deployment (AWS EC2)

This project is configured for automated deployment to AWS EC2 using GitHub Actions.

### Setup on EC2

1.  **Launch an EC2 Instance** (Ubuntu 22.04 LTS recommended).
2.  **Allow Ports**: Ensure Security Group allows Inbound traffic on ports `80` (HTTP), `443` (HTTPS), `22` (SSH), and `5000` (App).
3.  **Connect to your instance**:
    ```bash
    ssh -i "your-key.pem" ubuntu@13.127.89.209
    ```
4.  **Install Node.js & PM2**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo npm install -g pm2
    ```

### CI/CD Pipeline

The `.github/workflows/deploy.yml` file handles automated deployment. **Status: Configured & Ready.**

**Steps to configure:**

1.  Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions**.
2.  Add the following repository secrets:
    *   `EC2_HOST`: `13.127.89.209`
    *   `EC2_USER`: `ubuntu`
    *   `EC2_SSH_KEY`: Content of your `.pem` key file.

**Triggering Deployment:**

Every time you commit and push to the `main` branch, the workflow will:
1.  SSH into your EC2 instance.
2.  Pull the latest code.
3.  Install dependencies.
4.  Build the React frontend.
5.  Restart the application using PM2.

## 📄 License

This project is open-source and available under the MIT License.
