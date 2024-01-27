import { z } from 'zod';

export const ZCreateForm = z.object({
    name: z.string(),
    formSchema: z.object({}).passthrough(),
});
