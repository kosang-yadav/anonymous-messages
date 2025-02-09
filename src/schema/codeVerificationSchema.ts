import { z } from "zod";

export const codeVerificationSchema = z.object({
    code : z.string().length(6, {message : "verification code must be of 6 digits"})
})