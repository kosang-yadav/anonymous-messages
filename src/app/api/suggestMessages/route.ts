import OpenAI from "openai";

export async function GET() {
	const userPrompt =
		"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.";

	const systemPrompt =
		"You are an expert hacker and psychological person you need to frame some serious and mentally questions";

	try {
		const api = new OpenAI({
			apiKey: `${process.env.OPENAI_API_KEY}`,
			baseURL: `${process.env.OPENAI_API_BASE_URL}`,
		});

		// console.log(api);
		const result = await api.chat.completions.create({
			model: "gpt-4o-mini-2024-07-18",
			messages: [
				{
					role: "system",
					content: systemPrompt,
				},
				{
					role: "user",
					content: userPrompt,
				},
			],
		});
		// console.log(result);

		const questions = result?.choices[0].message.content;

		console.log(`Assistant: ${questions}`);

		return Response.json(
			{
				success: true,
				message: "messages suggested successfully.",
				questions,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.log(error);
		console.log(error.message, error.error, error.code);
		return Response.json({
			success : false,
			message : "something went wrong while suggesting messages, please try later",
		}, { status: 555 });
	}
}
// const { username} = await req.json();
// hard coded test values
// const test =
("What experiences or challenges have shaped your perspective on personal growth in the past year? || How do you define success, and what steps are you taking to achieve it in your life? || In what ways do you think your relationships influence your decision-making processes?");

// await dbConnect();

// const user = await UserModel.findOne({ username });

// if (!user)
// 	return Response.json(
// 		{
// 			success: false,
// 			message: "not authorised to get suggestions",
// 		},
// 		{ status: 404 }
// 	);

// if (new Date() < user.suggestMessages) {
// 	if (reqno !== 1)
// 		return Response.json(
// 			{
// 				success: false,
// 				message: "can't get suggestions now...",
// 			},
// 			{ status: 403 }
// 		);

// user.suggestMessages = new Date(Date.now() + 3600000);
// await user.save();
// 	return Response.json(
// 		{
// 			success: true,
// 			message: "messages suggested successfully.",
// 			questions: test,
// 		},
// 		{ status: 200 }
// 	);
// }
