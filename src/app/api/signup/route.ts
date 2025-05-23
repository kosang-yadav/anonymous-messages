import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { signUpSchema } from "@/schema/signUpSchema";

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationMail } from "@/helper/resendVerificationMail";
import { sendEmail, sendRealEmail } from "@/helper/mailTrapVerificationMail";
import { sendMail } from "@/helper/appwriteVerificationMail";

export async function POST(request: NextRequest) {
	await dbConnect();

	const { username, email, password } = await request.json();
	// console.log(username, email, password);

	try {
		const { success, error } = signUpSchema.safeParse({
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

		const user = await UserModel.findOne({ email }).select("-messages");

		// console.log(user);

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

			//mail send by resend
			// const mailResponse = await sendVerificationMail(
			// 	username,
			// 	email,
			// 	verifyCode
			// );

			//mail send by mailtrap
			// const mailResponse = await sendRealEmail(username, email, verifyCode);

			//mail send by appwrite
			const mailResponse = await sendMail(username, email, verifyCode);

			// console.log("mailResponse : ", mailResponse);
			if (!mailResponse.success)
				return Response.json(
					{
						success: false,
						message: mailResponse.message,
					},
					{
						status: 500,
					}
				);

			user.password = hashedPassword;
			user.verifyCode = verifyCode;
			user.verifyCodeExpiry = new Date(Date.now() + 3600000);

			const updatedUser = await user.save();

			// console.log("updatedUser : ",updatedUser);
			if (updatedUser.verifyCode === verifyCode && updatedUser.password === hashedPassword)
				return Response.json(
					{
						success: true,
						message: `user verified & details updated successfully`,
					},
					{
						status: 200,
					}
				);

			return Response.json(
				{
					success: false,
					message: `failed to update user details, please check your internet connection`,
				},
				{
					status: 500,
				}
			);
		}

		// for new user, send verification mail & insert the user data to db
		//mail by resend
		// const mailResponse = await sendVerificationMail(
		// 	username,
		// 	email,
		// 	verifyCode
		// );

		//mail by mailtrap
		// const mailResponse = await sendRealEmail(username, email, verifyCode);

		//mail by appwrite
		const mailResponse = await sendMail(username, email, verifyCode);

		// console.log("mailResponse : ",mailResponse);
		if (!mailResponse.success)
			return Response.json(
				{
					success: false,
					message: mailResponse.message,
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
					message: `user registered successfully`,
					data: newUser,
				},
				{
					status: 200,
				}
			);

		return Response.json(
			{
				success: false,
				message: `failed to register new user`,
			},
			{
				status: 500,
			}
		);
	} catch (error) {
		console.log("catch error : ", error);
		return Response.json(
			{
				success: false,
				message: `failed to sign up the user `,
			},
			{ status: 500 }
		);
	}
}
