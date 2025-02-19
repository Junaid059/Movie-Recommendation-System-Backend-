import express from 'express';
import ConnectDB from './database/index.js';
import { config } from 'dotenv';
import userRoutes from './routes/user.routes.js';
config({
  path: './.env',
});

const app = express();

const PORT = process.env.PORT || 8001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);
ConnectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  )
  .catch((error) => {
    console.log('Error ', error);
  });
