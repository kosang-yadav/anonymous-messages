import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/model/user.model";
import UserModel from "@/model/user.model";

import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				identifier: { label: "Username/Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials): Promise<User | any> {
				await dbConnect();
				try {
					// console.log(credentials);

					//why is it solving a type error, try commenting the below line, any logic ?
					// if (!credentials?.email || !credentials?.password) throw new Error("email or password not found");

					const user = await UserModel.findOne({
						$or: [
							{ email: credentials?.identifier },
							{ username: credentials?.identifier, isVerified: true },
						],
					});
					// console.log(user);
					if (!user)
						throw new Error(" no user found with this email, please sign up");

					if (!user.isVerified)
						throw new Error("please verify the email to login");

					const isPasswordCorrect = await bcrypt.compare(
						credentials?.password || "",
						user.password
					);

					if (!isPasswordCorrect) throw new Error("wrong password");

					return user;
				} catch (error: any) {
					console.log(error);
					throw new Error(error);
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			// console.log("user : ", user, "token : ", token);
			if (user) {
				token._id = user._id?.toString();
				token.username = user.username;
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
			}
			// console.log("user : ", user, "token : ", token);
			return token;
		},
		async session({ session, token }) {
			// console.log("session : ", session, "token : ", token);
			if (token) {
				session.user._id = token._id;
				session.user.username = token.username;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessages = token.isAcceptingMessages;
			}
			// console.log("session : ", session, "token : ", token);
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};
