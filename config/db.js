import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MongoDB_URI);

    console.log(
      `MongoDb connected !! Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log('MongoDb connection Error', error);
  }
};

export default dbConnect;
