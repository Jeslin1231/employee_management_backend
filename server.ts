import mongoose from 'mongoose';
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import cors from 'cors';
import dotenv from 'dotenv';
import schema from './schema/schema';

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

app.all('/graphql', createHandler({ schema }));

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
