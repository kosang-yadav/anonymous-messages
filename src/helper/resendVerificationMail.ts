import { apiResponseSchema } from "@/types/apiResponse";
import { VerificationMailTemplate } from "../../mail/verificationMailTemplate";
import { resend } from "@/lib/resend";

export async function sendVerificationMail(
	username: string,
	email: string,
	verifyCode: string
): Promise<apiResponseSchema> {
	try {
		const { data, error } : { data: any; error: any } = await resend.emails.send({
			from: "Bakaonboarding@resend.dev",
			to: email,
			subject: "verification code for anonymous messages",
			react: VerificationMailTemplate({ username, otp: verifyCode }),
		});
		
		// console.log(data);
		if (error) {
			console.log(error);
			
			return {
				success: false,
				statusCode: error.statusCode,
				message: `failed to send email of verification code to ${email}, please check your internet connection`,
			};
		}


		return {
			success: true,
			statusCode: 200,
			message: `verification code sent successfully, please check ${email}`,
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			statusCode: 500,
			message: `failed to send verification code to ${email}`,
		};
	}
}
