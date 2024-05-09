import { z } from 'zod'

export const ZAddkey = z.object({
  name: z.string(),
})

export const ZDeletekey = z.object({
  id: z.string(),
})

export const ZDisablekey = z.object({
  id: z.string(),
})

export const ZEnablekey = z.object({
  id: z.string(),
})
