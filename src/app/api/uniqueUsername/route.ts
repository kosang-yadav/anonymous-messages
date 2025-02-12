import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schema/signUpSchema";

import { NextRequest } from "next/server";
import { z } from "zod";

const usernameQuerySchema = z.object({ username: usernameValidation });

export async function GET(req: NextRequest) {
	await dbConnect();

	const { searchParams } = new URL(req.url);

	const queryParams = {
		username: searchParams.get("username"),
	};

    if(!queryParams.username) return Response.json(
        {
            success :false,
            message : "username is required"
        },
        {status : 500}
    )

	try {
		const { success, error, data } = usernameQuerySchema.safeParse(queryParams);
	
		if (!success)
			return Response.json(
				{
					success: false,
					message: error.format().username?._errors || "Invalid username",
				},
				{ status: 400 }
			);
	
		const username = data.username;
	    // console.log(username);
	
		const user = await UserModel.findOne({ username, isVerified: true });
	
		if (user)
			return Response.json(
				{
					success: false,
					message: "username is already taken",
				},
				{ status: 400 }
			);
	
		return Response.json(
			{
				success: true,
				message: "username is unique",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "couldn't verify whether username is unique or not with error : " + error,
			},
			{ status: 400 }
		);
	}
}
