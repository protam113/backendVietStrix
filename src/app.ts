import express from 'express';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import corsConfig from './config/cors';
import { logRequest } from './middleware/logRequest';
import routes from './routes'; // Gộp tất cả routes
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();

const app = express();

const swaggerDocument = YAML.load(
  path.join(__dirname, '..', 'src', 'docs', 'api.yaml')
);
const mail = process.env.EMAIL_USER;
console.log(mail);
// Cấu hình Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}`, routes);

export default app;
