import { WebhookTriggerEvent } from '@prisma/client'
import { z } from 'zod'

export const ZAddWebhook = z.object({
  name: z.string(),
  url: z.string(),
  secret: z.string(),
  events: z.array(z.nativeEnum(WebhookTriggerEvent)),
})

export const ZUpdateWebhook = z
  .object({
    id: z.string(),
  })
  .and(ZAddWebhook.partial())

export const ZDeleteWebhook = z.object({
  id: z.string(),
})

export const ZDisableWebhook = z.object({
  id: z.string(),
})

export const ZEnableWebhook = z.object({
  id: z.string(),
})
