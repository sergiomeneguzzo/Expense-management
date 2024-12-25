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
app.options('*', cors(corsOptions));

app.use(cors(corsOptions));

app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  next();
});

app.use('/api', apiRouter);

export default app;
