import * as z from 'zod'

export const ZAddApiKeyForm = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(4),
})

export type TAddApiKeyForm = z.infer<typeof ZAddApiKeyForm>
