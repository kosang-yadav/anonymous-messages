import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOption";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function DELETE(req: NextRequest) {
	const session = await getServerSession(authOptions);
	const { messageId } = await req.json();

	if (!messageId)
		return Response.json(
			{
				success: false,
				message: "message's id is required to delete the message",
			},
			{ status: 500 }
		);

	await dbConnect();
	try {
		const user = await UserModel.findByIdAndUpdate(
			session?.user._id,
			{
				$pull: {
					messages: {
						_id: messageId,
					},
				},
			},
			{ new: true }
		);

		if (!user)
			return Response.json(
				{
					success: false,
					message: "user not found",
				},
				{ status: 500 }
			);

		return Response.json(
			{
				success: true,
				message: "message deleted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "failed to delete message",
			},
			{ status: 500 }
		);
	}
}
