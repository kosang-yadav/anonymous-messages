import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { signUpSchema } from "@/schema/signUpSchema";

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationMail } from "@/helper/verificationMail";

export async function POST(request: NextRequest) {
	await dbConnect();

	const { username, email, password } = await request.json();
	// console.log(username, email, password);

	try {
		const { success, data, error } = signUpSchema.safeParse({
			email,
			username,
			password,
		});

		if (!success)
			return Response.json(
				{
					success: false,
					message: `sign up validation failed with error : ${error.format().email?._errors || error.format().username?._errors || error.format().password?._errors}`,

					//use it to see complete error
					// message : 'error : ' + (error)
				},
				{
					status: 500,
				}
			);

		const hashedPassword = await bcrypt.hash(password, 10);

		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		// const verifyCodeExpiry = new Date();
		// verifyCodeExpiry = verifyCodeExpiry.setHours( verifyCodeExpiry.getHours() + 1 );

		const user = await UserModel.findOne({ email }).select("password");

		if (user) {
			//when user is found and verified already, no need to do anything

			if (user.isVerified)
				return Response.json(
					{
						success: false,
						message: ` user already exists with the ${email} & verified, please try sign In`,
					},
					{
						status: 500,
					}
				);

			//when user is found but not verified, then send verification mail &update password and verifyCode

			const mailResponse = await sendVerificationMail(
				username,
				email,
				verifyCode
			);

			if (!mailResponse.success)
				return Response.json(
					{
						success: false,
						message: `failed to send verification mail to ${email}`,
					},
					{
						status: 500,
					}
				);

			const updatedUser = await UserModel.updateOne(
				{ email },
				{
					$set: {
						password: hashedPassword,
						verifyCode,
						verifyCodeExpiry: Date.now() + 3600000,
					},
				}
			).select("password");

			if (updatedUser)
				return Response.json(
					{
						success: true,
						message: `user verified & details updated successfully`,
						data: updatedUser,
					},
					{
						status: 200,
					}
				);
		}

		// for new user, send verification mail & insert the user data to db

		const mailResponse = await sendVerificationMail(
			username,
			email,
			verifyCode
		);

		console.log(mailResponse);

		if (!mailResponse.success)
			return Response.json(
				{
					success: false,
					message: `failed to send verification mail to ${email}`,
				},
				{
					status: 500,
				}
			);

		const newUser = await UserModel.insertOne({
			username,
			email,
			password: hashedPassword,
			isAcceptingMessages: true,
			isVerified: false,
			verifyCode,
			verifyCodeExpiry: Date.now() + 3600000,
			messages: [],
		});

		if (newUser)
			return Response.json(
				{
					success: true,
					message: `user created successfully`,
					data: newUser,
				},
				{
					status: 200,
				}
			);

		return Response.json(
			{
				success: false,
				message: `failed to create new user`,
			},
			{
				status: 500,
			}
		);
	} catch (error: any) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: `failed to sign up the user `,
			},
			{ status: 500 }
		);
	}
}
