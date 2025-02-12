import mongoose from "mongoose";
import { NextRequest } from "next/server";

import { getUserIdByServerSession } from "../acceptingMessage/route";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function GET(req: NextRequest) {
	await dbConnect();

	const id = await getUserIdByServerSession();
	if (typeof id !== "string") return id;

	try {
		const userId = new mongoose.Types.ObjectId(id);

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

		if (!user || user.length === 0)
			return Response.json(
				{
					success: false,
					message:
						"something went wrong while fetching sorted messages via aggregation pipelines",
				},
				{ status: 500 }
			);

		return Response.json(
			{
				success: true,
				message: " user's messages fetched successfully",
				messages: user[0].messages,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "failed to get user's messages with error : " + error,
			},
			{ status: 500 }
		);
	}
}
