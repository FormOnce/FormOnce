import { TRPCError } from '@trpc/server'
import * as argon2 from 'argon2'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

/** Index
 * signup: publicProcedure - create user
 **/

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), password: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.prisma.user.findFirst({
          where: {
            email: input.email,
          },
        })

        if (existingUser) {
          console.log('Email already in use')
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Email already in use',
          })
        }

        const hashedPassword = await argon2.hash(input.password, {
          saltLength: 12,
        })

        return await ctx.prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            WorkspaceMember: {
              create: {
                role: 'OWNER',
                Workspace: {
                  create: {
                    name: `${input.name}'s Workspace`,
                    isPersonal: true,
                  },
                },
              },
            },
          },
          include: {
            WorkspaceMember: {
              include: {
                Workspace: true,
              },
            },
          },
        })
      } catch (error) {
        console.log(error)
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }
    }),
})
