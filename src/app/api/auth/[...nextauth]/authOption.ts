import { dbConnect } from "@/lib/dbConnect";
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
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req): Promise<any> {
				try {
					console.log(credentials);

					//why is it solving a type error, try commenting the below line, any logic ?
					// if (!credentials?.email || !credentials?.password) throw new Error("email or password not found");

					await dbConnect();

					const user = await UserModel.findOne({
						$or: [
							{ email: credentials?.email },
							// {username : credentials?.username}
							// username is not working
						],
					});

					if (!user) throw new Error("user not found with email");

					if (!user.isVerified) throw new Error("please verify first to login");

					const isPasswordCorrect = await bcrypt.compare(
						credentials?.password || "",
						user.password
					);

					if (!isPasswordCorrect) throw new Error("wrong password");

					return user;
				} catch (error: any) {
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
			if (user) {
				token._id = user._id?.toString();
				token.username = user.username;
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.username = token.username;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessages = token.isAcceptingMessages;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};
