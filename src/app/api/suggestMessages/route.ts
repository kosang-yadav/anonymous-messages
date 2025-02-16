import OpenAI from "openai";

export async function GET(req: Request) {
	// const { prompt } = await req.json();

	const userPrompt =
		"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.";

	const systemPrompt =
		"You are an expert hacker and psychological person you need to frame some serious and mentally questions";

	// const api = new OpenAI({
	// 	apiKey: `${process.env.OPENAI_API_KEY}`,
	// 	baseURL: `${process.env.OPENAI_API_BASE_URL}`,
	// });

	// console.log(api);
	try {
		// const result = await api.chat.completions.create({
		// 	model: "gpt-4o-mini-2024-07-18",
		// 	messages: [
		// 		{
		// 			role: "system",
		// 			content: systemPrompt,
		// 		},
		// 		{
		// 			role: "user",
		// 			content: userPrompt,
		// 		},
		// 	],
		// });
		// console.log(result);

		const result =
			"What experiences or challenges have shaped your perspective on personal growth in the past year? || How do you define success, and what steps are you taking to achieve it in your life? || In what ways do you think your relationships influence your decision-making processes?";
		// const questions = result?.choices[0].message.content;

		const questions = result;
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
		return new Response(error.message, { status: 555 });
	}
}
