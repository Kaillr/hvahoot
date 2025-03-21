import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './routes/index.js';
import sendResponse from './helpers/sendResponse.js';
import errorHandler from './middleware/errorHandler.js';
import corsOptions from './config/corsOptions.js';

// Define constants
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use('/api', router);

// 404 catch all
app.all('*', (req, res) => {
    sendResponse({
        req,
        res,
        statusCode: 404,
        error: {
            code: 'NOT_FOUND',
            message: 'Requested endpoint not found.',
        },
    });
});

// Handle errors
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
