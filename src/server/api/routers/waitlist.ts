import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

/** Index
 * 1. Join Procedure: This procedure is used to add a user to the waitlist.
 **/

export const waitlistRouter = createTRPCRouter({
  join: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlist.upsert({
          where: { email: input.email },
          create: {
            email: input.email,
          },
          update: {
            email: input.email,
          },
          select: {
            email: true,
          },
        })
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }
    }),
})
