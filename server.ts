import mongoose from 'mongoose';
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import cors from 'cors';
import dotenv from 'dotenv';
import schema from './schema/schema';
import { authGql, authRest } from './middleware/auth';
import { upload, errorHandler } from './middleware/file';
import { handleFile } from './controllers/file';

dotenv.config();

mongoose
  .connect(process.env.URI || '', {})
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.log(err);
    throw err;
  });

const app = express();
app.use(cors());
app.use(express.static('/tmp/uploads'));
app.use(authGql);

app.all(
  '/graphql',
  createHandler({
    schema: schema,
    context: req => ({
      // @ts-ignore implicit any
      authorized: req.headers['x-authorized'] === 'true',
      // @ts-ignore implicit any
      userId: req.headers['x-decoded-id'] || null,
    }),
  }),
);

app.post('/upload', authRest, upload, errorHandler, handleFile);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
