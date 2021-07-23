/* eslint-disable no-console */
import mongoose from 'mongoose';

export function connectDb() {
  mongoose.connect(
    process.env.MONGODB_URI || '',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(`[Database] connection error: ${err.message}`);
        return;
      }
      console.log('[Database] connection stablished');
    },
  );
}
