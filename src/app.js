import express from 'express';
import ConnectDB from './database/index.js';
import { config } from 'dotenv';

config({
  path: './.env',
});

const app = express();

const PORT = process.env.PORT || 8001;
app.use(express.json());

ConnectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  )
  .catch((error) => {
    console.log('Error ', error);
  });
