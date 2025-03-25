import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'api-key'],
  credentials: true,
};

export default cors(corsOptions);
