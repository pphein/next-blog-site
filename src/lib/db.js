import mongoose, { connection } from "mongoose";

async function dbConnect() {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL, {
            userNewUrlParse: true,
            userUnifiedTopology: true,
        });

        connection.isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error.message);
    }
}

export default dbConnect;