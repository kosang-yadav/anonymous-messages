import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2,"username should have atleast 2 characters. ")
    .max(10, "username should not be more than 10 characters. ")
    .regex(/^[A-Za-z0-9_]+$/, "username should not have speacial characters. ")
    .trim();

export const signUpSchema = z.object({
    username : usernameValidation,
    email : z
        .string()
        .email({message : "email is not a valid email address. "}),
    password : z
        .string()
        .min(4, {message : "password should have atleast 4 characters. "})
        .max(16, {message : "password should not be greater than 16 characters. "})
})