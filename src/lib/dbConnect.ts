import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log("db is already connected, no need to connect again");
		return;
	}

	try {
		const db = await mongoose.connect(`${process.env.MONGODB_URI}/user`);
		connection.isConnected = db.connections[0].readyState;

		console.log("Connected to db, successfully");
	} catch (error) {
		console.log("failed to connect the db with error : ", error);
		process.exit(1);
	}
}
