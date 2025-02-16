import mongoose from "mongoose";

// import { getUserIdByServerSession } from "../acceptingMessages/route";

import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOption";

export async function GET() {
	await dbConnect();

	// const id = await getUserIdByServerSession();
	const session = await getServerSession(authOptions);
	// const User = session?.user;
	// console.log(session);
	// if (typeof id !== "string") return Response.json(
	// 	{
	// 		success: false,
	// 		message:
	// 			"user not found from session, please login again",
	// 	},
	// 	{ status: 500 }
	// ); ;

	try {
		const userId = new mongoose.Types.ObjectId(session?.user?._id);

		const user = await UserModel.aggregate([
			{
				$match: { _id: userId },
			},
			{
				$unwind: "$messages",
			},
			{
				$sort: {
					"messages.createdAt": -1,
				},
			},
			{
				$group: { _id: "$_id", messages: { $push: "$messages" } },
			},
		]);

		// console.log(user);
		if (!user)
			return Response.json(
				{
					success: false,
					message: "user not found from session, please login again",
				},
				{ status: 404 }
			);

		// if ( !user[0] || !user[0]?.messages || user[0]?.messages.length === 0)
		// 	return Response.json(
		// 		{
		// 			success: false,
		// 			message: "user has no messages to display",
		// 		},
		// 		{ status: 404 }
		// 	);
		return Response.json(
			{
				success: true,
				message: " anonymous messages fetched successfully",
				messages: user[0]?.messages,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "failed to fetch anonymous messages",
			},
			{ status: 500 }
		);
	}
}
