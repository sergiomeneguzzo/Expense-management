import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './api/routes';
import bodyParser from 'body-parser';
import './utils/auth/auth-handlers';

const app = express();

app.use(cors());
app.use(
  cors({
    origin: 'https://saveupp.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use('/api', apiRouter);

export default app;
