import { CorsOptions } from 'cors';

const allowedOrigins = ['http://localhost:3000'];

const corsOptions: CorsOptions = {
    origin: (origin, callback): void => {
        if ((origin && allowedOrigins.includes(origin)) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;
