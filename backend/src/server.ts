import express from 'express';
import 'dotenv/config';
import router from './routes/index.js';

// Define constants
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/', router);

// 404 catch all
app.all('*', (req, res) => {
    res.status(404).json({ error: 'Requested endpoint does not exist.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
