import { talkInputSchema } from "@/models/talk";
import { z } from "zod";

export const talkFormSchema = talkInputSchema;
export type TalkFormType = z.infer<typeof talkFormSchema>;
