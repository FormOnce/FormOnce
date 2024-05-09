import { z } from 'zod'
import { ZQuestion } from '~/types/question.types'

export const ZAddQuestion = z.object({
  formId: z.string().uuid(),
  question: ZQuestion,
})
