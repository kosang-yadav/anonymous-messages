import { client, messaging, users, ID } from "@/lib/appwrite";
import { apiResponseSchema } from "@/types/apiResponse";
import { stat } from "fs";

const userID = `${process.env.APPWRITE_USER_ID}`;
const topicID = ["683062e3000ceebeec47"];
const defaultEmail = "anonymous@anonymous.com";

const subject = "Verification Code";
// const content = "verify yourself to join anonymous messages";

const changeEmail = async (email: string) => {
  try {
    console.log({ userID });
    return await users.updateEmail(userID, email);
  } catch (error) {
    console.log("AppWrite :: updateEmail :: error - ", error);
    return false;
  }
};

const sendMessage = async (username: string, verifyCode: string) => {
  const content = `<html lang="en" dir="ltr">
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
		</html>`;

  try {
    await messaging.createEmail(
      ID.unique(),
      subject,
      content,
      topicID,
      [],
      [],
      [],
      [],
      [],
      false,
      true,
    );
    return true;
  } catch (error) {
    console.log("AppWrite :: sendOTP :: error - ", error);
    return false;
  }
};

export const sendMail = async (
  username: string,
  email: string,
  verifyCode: string,
): Promise<apiResponseSchema> => {
  try {
    const isChanged = await changeEmail(email);
    if (isChanged) {
      const mailSent = await sendMessage(username, verifyCode);
      if (mailSent) {
        changeEmail(defaultEmail);
        return {
          message: `great : verification code sent successfully, please check ${email}`,
          statusCode: 200,
          success: true,
        };
      }

      return {
        message: `mid : failed to send verification mail`,
        statusCode: 500,
        success: false,
      };
    } else
      return {
        message: `strt : failed to send email of verification code to ${email}, please check your internet connection`,
        statusCode: 500,
        success: false,
      };
  } catch (error) {
    console.log("AppWrite :: getOTP :: error - ", error);
    return {
      message: `catch : failed to send email of verification code to ${email}, please check your internet connection`,
      statusCode: 500,
      success: false,
    };
  }
};
