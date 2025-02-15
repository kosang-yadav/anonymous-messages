import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

import { authOptions } from "../auth/[...nextauth]/authOption";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

// export const getUserIdByServerSession = async () => {
// 	const session = await getServerSession(authOptions);
// 	const user = session?.user;
// 	console.log(session, user);

// 	if (!session || !user)
// 		return Response.json(
// 			{
// 				success: false,
// 				message: "not authenticated",
// 			},
// 			{ status: 401 }
// 		);

// 	return user?._id;
// };

export async function POST(req: NextRequest) {
	await dbConnect();

	const session = await getServerSession(authOptions);
	const user = session?.user;
	// console.log(session, user);
	const userId = user?._id;

	//if boolean value to toggle comes via query params
	// const { searchParams } = new URL(req.url);
	// const acceptsMessage = searchParams.get("acceptsMessage");

	// if (!acceptsMessage)
	// 	return Response.json(
	// 		{
	// 			success: false,
	// 			message: "acceptsMessage is required",
	// 		},
	// 		{ status: 500 }
	// 	);

	// else if it's coming via body
	const {acceptsMessage} = await req.json();

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{
				$set: { isAcceptingMessages: acceptsMessage },
			},
			{ new: true }
		);

		if (updatedUser)
			return Response.json(
				{
					success: true,
					message: "user's message acceptance status updated successfully",
				},
				{ status: 200 }
			);

		return Response.json(
			{
				success: false,
				message: "failed to update message acceptance status",
			},
			{ status: 500 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "failed to toggle message acceptance status" + error,
			},
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest) {
	await dbConnect();

	// const userId = await getUserIdByServerSession();
	const session = await getServerSession(authOptions);
	const User = session?.user;
	// console.log(session);

	try {
		const user = await UserModel.findById(session?.user?._id);

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
				message: `user's message acceptance status is ${user.isAcceptingMessages}`,
				acceptingMessages: user.isAcceptingMessages,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message:
					"failed to get user's message acceptance status with error : " +
					error,
			},
			{ status: 500 }
		);
	}
}
