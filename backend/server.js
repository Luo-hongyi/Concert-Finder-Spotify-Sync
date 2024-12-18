const env = require('dotenv').config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { url } = require('./config/mongodb.config');
const authRoutes = require('./routes/auth.route');
const artistRoutes = require('./routes/artist.route');
const syncSpotifyRoutes = require('./routes/spotify-sync.route');
const eventRoutes = require('./routes/event.route');
console.log('.env: ', env.parsed);

// Connect to MongoDB
mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

// security middleware
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-domain resource sharing
//   })
// );
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// Cross-domain middleware
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGINS.split(';'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    exposedHeaders: ['ETag'],
  })
);

// Parse JSON request body middleware
app.use(express.json());

// Request log middleware
morgan.token('time', function () {
  return new Date().toLocaleTimeString();
});
app.use(morgan(':time :method :url :status :response-time ms - :res[content-length]'));

// Cache control middleware
// The standard practice is to set cache control for each route
// here is a simple unified setting
app.use((req, res, next) => {
  if (req.method === 'GET') {
    // Generate time-based ETag, change every 10 seconds
    const timestamp = Math.floor(Date.now() / 10000);
    const etag = `"${timestamp}"`;

    // Check client's If-None-Match header
    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    res.set({
      'Cache-Control': 'private, must-revalidate',
      ETag: etag,
      Vary: 'Authorization',
    });
  }
  next();
});

// Routes
app.use('/', authRoutes); // Auth routes
app.use('/', artistRoutes); // Artist routes
app.use('/', syncSpotifyRoutes); // Spotify sync routes
app.use('/', eventRoutes); // Event routes

// 404 processing
app.use((req, res) => {
  console.log('\nRoute Not Found:', req.method, req.url);
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Not Found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Show the source of the error and only show the last n-level paths
  const stackLines = err.stack.split('\n');
  const lastLine = stackLines[stackLines.length - 1];
  const path = lastLine.split('/').slice(-4).join('/');
  console.error(`Check -> ./${path}`);

  const statusCode = err.response?.status || err.status || 500;
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: err.message,
  });

  next();
});

// Start the server
app.listen(process.env.BACKEND_PORT_INTERNAL, () => {
  console.log('\nServer is running on port:', process.env.BACKEND_PORT_INTERNAL);
});
