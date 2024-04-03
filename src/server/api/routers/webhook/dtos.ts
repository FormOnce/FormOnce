import { z } from 'zod';
import { WebhookTriggerEvent } from '@prisma/client';

export const ZAddWebhook = z.object({
    name: z.string(),
    url: z.string(),
    secret: z.string(),
    event: z.nativeEnum(WebhookTriggerEvent),
});

export const ZUpdateWebhook = z.object({
    id: z.string()
}).and(ZAddWebhook.partial());

export const ZDeleteWebhook = z.object({
    id: z.string(),
});

export const ZDisableWebhook = z.object({
    id: z.string(),
});

export const ZEnableWebhook = z.object({
    id: z.string(),
});