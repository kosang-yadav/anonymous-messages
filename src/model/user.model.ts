import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
	content: string;
	createdAt: Date;
}

export interface User extends Document {
	username: string;
	email: string;
	password: string;
	isAcceptingMessages: boolean;
	isVerified: boolean;
	verifyCode: string;
	verifyCodeExpiry: Date;
	messages: Message[];
	createdAt: Date;
}

const Messageschema: Schema<Message> = new Schema({
	content: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Userschema: Schema<User> = new Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "password is required"],
		},
		isAcceptingMessages: {
			type: Boolean,
			default: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verifyCode: String,
		verifyCodeExpiry: {
			type: Date,
			default: Date.now,
		},
		messages: [Messageschema],
	},
	{ timestamps: true }
);

const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", Userschema);

export default UserModel;
