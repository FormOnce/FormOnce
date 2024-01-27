import { z } from "zod";
import { ZQuestion } from "./question.types";

export const ZFormSchema = z.object({
    questions: z.array(ZQuestion).min(1),
});

export type TFormSchema = z.infer<typeof ZFormSchema>;