import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

import { ZAddkey, ZDeletekey, ZDisablekey, ZEnablekey } from './dtos'

/** Index
 * getAll: protectedProcedure - get all keys
 * create: protectedProcedure - create a new key
 * delete: protectedProcedure - delete a key
 * disable: protectedProcedure - disable a key
 * enable: protectedProcedure - enable a key
 **/

export const ApikeyRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.apiKey.findMany({
        where: {
          workspaceId: ctx.session.user.workspaceId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    } catch (error) {
      console.log(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'could not get key, please try again later.',
      })
    }
  }),

  create: protectedProcedure.input(ZAddkey).mutation(async ({ ctx, input }) => {
    try {
      return await ctx.prisma.apiKey.create({
        data: {
          name: input.name,
          key:
            Math.random().toString(36).substring(2) +
            Math.random().toString(36).substring(2),
          createdById: ctx.session.user.id,
          workspaceId: ctx.session.user.workspaceId,
        },
      })
    } catch (error) {
      console.log(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'could not create key, please try again later.',
      })
    }
  }),
  delete: protectedProcedure
    .input(ZDeletekey)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.apiKey.delete({
          where: {
            id: input.id,
            workspaceId: ctx.session.user.workspaceId,
          },
        })
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'could not delete key, please try again later.',
        })
      }
    }),

  disable: protectedProcedure
    .input(ZDisablekey)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.apiKey.update({
          where: {
            id: input.id,
            workspaceId: ctx.session.user.workspaceId,
          },
          data: {
            enabled: false,
          },
        })
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'could not disable key, please try again later.',
        })
      }
    }),

  enable: protectedProcedure
    .input(ZEnablekey)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.apiKey.update({
          where: {
            id: input.id,
            workspaceId: ctx.session.user.workspaceId,
          },
          data: {
            enabled: true,
          },
        })
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'could not enable key, please try again later.',
        })
      }
    }),
})
