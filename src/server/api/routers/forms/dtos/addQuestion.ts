import { z } from 'zod'
import { ZLogic, ZQuestion } from '~/types/question.types'

export const ZAddQuestion = z.object({
  formId: z.string().uuid(),
  question: ZQuestion,
  targetIdx: z.number(),
  targetQuestionId: z.string(),
  sourceLogic: ZLogic.optional(),
})
