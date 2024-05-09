import { WebhookTriggerEvent } from '@prisma/client'
import * as z from 'zod'

export const ZAddWebhookForm = z.object({
  url: z.string().url('Must be a valid URL'),
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(5, 'Name must be atleast 5 chars long ')
    .max(100, 'Name must not exceed 100 chars'),
  secret: z
    .string({
      required_error: 'Secret is required',
    })
    .min(6, 'Secret must be atleast 6 chars long')
    .max(100, 'Secret must not exceed 100 chars'),
  events: z
    .array(z.nativeEnum(WebhookTriggerEvent))
    .min(1, 'Must select atleast one event'),
})

export type TAddWebhookForm = z.infer<typeof ZAddWebhookForm>
