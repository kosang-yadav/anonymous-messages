import { z } from "zod";

export const messageSchema = z.object({
	content: z.string(),
	createdAt: z.date(),
});
