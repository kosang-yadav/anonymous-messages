import { MailtrapTransport } from "mailtrap";
import nodemailer from "nodemailer";

const sendEmail = async (
	username: string,
	email: string,
	verifyCode: string
) => {
	// console.log("username : ", username, "email : ", email);
	const transporter = nodemailer.createTransport({
		host: `${process.env.MAILTRAP_HOST}`,
		port: parseInt(`${process.env.MAILTRAP_PORT}`),
		auth: {
			user: `${process.env.MAILTRAP_USER}`,
			pass: `${process.env.MAILTRAP_PASS}`,
		},
	});

	// console.log("transporter : ", transporter);

	const mailOptions = {
		from: `${process.env.MAILTRAP_SENDER}`,
		to: email,
		subject: "verification code to join anonymous messages",

		html: `<html lang="en" dir="ltr">
			<head>
				<title>Verification Code</title>
			</head>
			<section>
				<div>
					<h1>Hello ${username},</h1>
				</div>
				<div>
					<h2>
						Thank you for registering. Please use the following verification
						code to complete your registration:
					</h2>
				</div>
				<div>
					<h1>${verifyCode}</h1>
				</div>
				<div>
					<h2>
						If you did not request this code, please ignore this email.
					</h2>
				</div>
			</section>
		</html>`,
	};

	// console.log("mailOptions : ", mailOptions);

	const response = await transporter.sendMail(mailOptions);
	// console.log("response : ", response);
	return response;
};

const sendRealEmail = async (
	username: string,
	email: string,
	verifyCode: string
) => {
	const transport = nodemailer.createTransport(
		MailtrapTransport({
			token: `${process.env.API_TOKEN}`,
		})
	);

	const sender = {
		address: `${process.env.MAILTRAP_SENDER}`,
		name: "Baka",
	};
	const recipients = [email];

	const response = await transport.sendMail({
		from: sender,
		to: recipients,
		category: "Integration Test",
		subject: "verification code to join anonymous messages",

		html: `<html lang="en" dir="ltr">
			<head>
				<title>Verification Code</title>
			</head>
			<section>
				<div>
					<h1>Hello ${username},</h1>
				</div>
				<div>
					<h2>
						Thank you for registering. Please use the following verification
						code to complete your registration:
					</h2>
				</div>
				<div>
					<h1>${verifyCode}</h1>
				</div>
				<div>
					<h2>
						If you did not request this code, please ignore this email.
					</h2>
				</div>
			</section>
		</html>`,
	});

	// console.log("response", response);
	return response;
};

export { sendEmail, sendRealEmail };
