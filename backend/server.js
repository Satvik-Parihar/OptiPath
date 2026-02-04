const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Force production mode if not set
const NODE_ENV = process.env.NODE_ENV || 'production';

console.log('🔍 NODE_ENV:', NODE_ENV);

app.use(cors());
app.use(express.json());

// API Routes MUST come before static file serving
const algoRoutes = require('./routes/algoRoutes');
app.use('/api/algo', algoRoutes);

// Serve static files from the React app
const distPath = path.resolve(__dirname, '../frontend/dist');
const indexPath = path.resolve(distPath, 'index.html');

console.log('📁 Serving static files from:', distPath);
console.log('📄 Index file:', indexPath);

// Serve static files
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.use((req, res) => {
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT} in ${NODE_ENV} mode`);
});
