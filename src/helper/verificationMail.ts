import { apiResponseSchema } from "@/types/apiResponse";
import { VerificationMailTemplate } from "../../mail/verificationMailTemplate";
import { resend } from "@/lib/resend";

export async function sendVerificationMail(
	username: string,
	email: string,
	verifyCode: string
): Promise<apiResponseSchema> {
	try {
		const { data, error } = await resend.emails.send({
			from: "Bakaonboarding@resend.dev",
			to: email,
			subject: "verification code for anonymous messages",
			react: VerificationMailTemplate({ username, otp: verifyCode }),
		});

		if (error) {
			return {
				success: false,
				statusCode: 500,
				message: `resend's send mail function failed to email`,
			};
		}

		return {
			success: true,
			statusCode: 200,
			message: "mail sent successfully",
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			statusCode: 500,
			message: `our send mail function failed`,
		};
	}
}
