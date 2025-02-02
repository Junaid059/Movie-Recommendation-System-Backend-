import mongoose from 'mongoose';

const ConnectDB = async () => {
  try {
    await mongoose
      .connect('mongodb://127.0.0.1:27017/movie recommendation')
      .then(console.log('Mongodb Connected'));
  } catch (error) {
    console.log('Error ', error);
  }
};

export default ConnectDB;
