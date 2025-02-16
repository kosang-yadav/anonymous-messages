import { dbConnect } from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/user.model";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	await dbConnect();

	const { username, content } =
		await req.json();
	if (!username || username.trim().length === 0)
		return Response.json(
			{
				success: false,
				message: "username is missing",
			},
			{ status: 500 }
		);
	if (!content || content.trim().length === 0)
		return Response.json(
			{
				success: false,
				message: "please type something to send a message",
			},
			{ status: 500 }
		);

	try {
		const user = await UserModel.findOne({ username, isVerified: true });
		if (!user)
			return Response.json(
				{
					success: false,
					message: "user not found",
				},
				{ status: 500 }
			);

		if (!user.isAcceptingMessages)
			return Response.json(
				{
					success: false,
					message: `@${username} is not accepting messages now`,
				},
				{ status: 500 }
			);

        const message = {
            content,
            createdAt : new Date()
        } as Message

		user.messages.push(message);
		await user.save();

		return Response.json(
			{
				success: true,
				message: "the message is sent successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "failed to send the message with error : " + error,
			},
			{ status: 500 }
		);
	}
}
