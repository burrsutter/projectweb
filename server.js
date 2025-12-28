const express = require('express');
const path = require('path');
const db = require('./database/init');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Start server after ensuring database schema
const startServer = async () => {
    await db.init();
    app.listen(PORT, () => {
        console.log(`Pokemon Favorites server running at http://localhost:${PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
