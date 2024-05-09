import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

/** Index
 * create: privateProcedure - create new workspace and add current user as owner
 **/

export const workspaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id
        return await ctx.prisma.workspace.create({
          data: {
            name: input.name,
            isPersonal: false,
            WorkspaceMembers: {
              create: {
                role: 'OWNER',
                User: {
                  connect: {
                    id: userId,
                  },
                },
              },
            },
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

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id
        const workspace = await ctx.prisma.workspace.findFirst({
          where: {
            id: input.id,
            WorkspaceMembers: {
              some: {
                userId: userId,
              },
            },
          },
        })
        if (!workspace) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Workspace not found',
          })
        }
        return workspace
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id
      const workspace = await ctx.prisma.workspace.findMany({
        where: {
          WorkspaceMembers: {
            some: {
              userId: userId,
            },
          },
        },
      })
      if (!workspace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workspace not found',
        })
      }
      return workspace
    } catch (error) {
      console.log(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      })
    }
  }),
})
