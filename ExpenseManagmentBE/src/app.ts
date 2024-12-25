import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './api/routes';
import bodyParser from 'body-parser';
import './utils/auth/auth-handlers';

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://expense-management-m7iwel2ql-sergios-projects-c91d784c.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use('/api', apiRouter);

export default app;
