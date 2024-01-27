import { z } from 'zod'
import { ZQuestion } from '~/types/question.types';;

export const ZCreateForm = z.object({
    name: z.string(),
    questions: z.array(ZQuestion),
});
