import { z } from "zod";

export const signInSchema = z.object({
	identifier: z.string().min(2, "username should have atleast 2 characters. "),
	password: z
		.string()
		.min(4, { message: "password should have atleast 4 characters. " }),
});