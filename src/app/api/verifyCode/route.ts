import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	await dbConnect();

	const { email, code } = await req.json();
	console.log(email, code);

	const decodedEmail = decodeURIComponent(email);

	try {
		const user = await UserModel.findOne({ email: decodedEmail });

		if (!user)
			return Response.json(
				{
					success: false,
					message: "user not found",
				},
				{ status: 404 }
			);

		const isCodeCorrect = user.verifyCode === code;
		const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

		if (!isCodeExpired && isCodeCorrect) {
			user.isVerified = true;
			await user.save();

			return Response.json(
				{
					success: true,
					message: "user verified successfully",
				},
				{ status: 200 }
			);
		} else if (isCodeExpired)
			return Response.json(
				{
					success: false,
					message:
						"verification code is expired, please signup again to get new code",
				},
				{ status: 500 }
			);
		else
			return Response.json(
				{
					success: false,
					message: "verification code is wrong",
				},
				{ status: 500 }
			);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "failed to verify code with error : " + error,
			},
			{ status: 500 }
		);
	}
}
