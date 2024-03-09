import { z } from 'zod';
import { ZQuestion } from '~/types/question.types';

export const ZEditQuestion = z.object({ formId: z.string().uuid(), question: ZQuestion.and(z.object({ id: z.string().uuid() })) });

