import mongoose from 'mongoose';

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.warn('Atlas connection is currently pending configuration.\n');
        return;
    }

    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`DB Connected successfully to host: ${conn.connection.host}`);
    } catch (error) {
        console.error('DB Connection error:', error.message);
    }
};
