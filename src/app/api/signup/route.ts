import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { signUpSchema } from "@/schema/signUpSchema";
import { apiResponseSchema } from "@/type/apiResponse";

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationMail } from "@/helper/verificationMail";

export async function POST(request: NextRequest): Promise<apiResponseSchema> {
	try {
		const { username, email, password } = await request.json();

		const { success, data, error } = signUpSchema.safeParse({
			username,
			email,
			password,
		});

		if (!success || error)
			return {
				success: false,
				statusCode: 500,
				message: `sign up validation failed with error : ${error.message}`,
				error,
			};

		await dbConnect();

		const hashedPassword = bcrypt.hash(password, 10);

		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		const verifyCodeExpiry = new Date();
		// verifyCodeExpiry = verifyCodeExpiry.setHours( verifyCodeExpiry.getHours() + 1 );

		const user = await UserModel.findOne({ email }).select("password");

		if (user) {

			//when user is found and verified already, no need to do anything
			
			if (user.isVerified)
				return {
					success: false,
					statusCode: 500,
					message: ` user already exists with the ${email} & verified, please try sign In`,
				};

			//when user is found but not verified, then send verification mail &update password and verifyCode

			const mailResponse = await sendVerificationMail(
				username,
				email,
				verifyCode
			);

			if (!mailResponse.success)
				return {
					success: false,
					statusCode: 500,
					message: `failed to send verification mail to ${email}`,
				};

			const updatedUser = await UserModel.updateOne(
				{ email },
				{
					$set: {
						password: hashedPassword,
						verifyCode,
						verifyCodeExpiry: Date.now() + 3600,
					},
				}
			).select("password");

			if (updatedUser)
				return {
					success: true,
					statusCode: 200,
					message: `user verified & details updated successfully`,
					data: updatedUser,
				};
		}

		// for new user, send verification mail & insert the user data to db

		const mailResponse = await sendVerificationMail(
			username,
			email,
			verifyCode
		);

		if (!mailResponse.success)
			return {
				success: false,
				statusCode: 500,
				message: `failed to send verification mail to ${email}`,
			};
			
		const newUser = await UserModel.insertOne({
			email,
			password: hashedPassword,
			isAcceptingMessages: true,
			isVerified: false,
			verifyCode,
			verifyCodeExpiry,
			messages: [],
		});

		if (newUser)
			return {
				success: true,
				statusCode: 200,
				message: `user created successfully`,
				data: newUser,
			};

		return {
			success: false,
			statusCode: 500,
			message: `failed to create new user`,
		};
	} catch (error: any) {
		return {
			success: false,
			statusCode: 500,
			message: `failed to sign up the user with error : ${error.message}`,
			error,
		};
	}
}
