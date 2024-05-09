import { z } from 'zod'

export const ZUpdateForm = z.object({
  id: z.string(),
  name: z.string().optional(),
  formSchema: z.object({}).passthrough().optional(),
  questions: z.array(z.object({}).passthrough()).optional(),
})
