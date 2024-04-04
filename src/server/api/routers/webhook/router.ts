import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter, protectedProcedure,
} from "~/server/api/trpc";

import { ZAddWebhook, ZDeleteWebhook, ZDisableWebhook, ZEnableWebhook, ZUpdateWebhook } from "./dtos";

/** Index
 * getAll: protectedProcedure - get all webhooks
 * create: protectedProcedure - create a new webhook
 * delete: protectedProcedure - delete a webhook
 * disable: protectedProcedure - disable a webhook
 * enable: protectedProcedure - enable a webhook
 * update: protectedProcedure - update a webhook
 **/

export const webhooksRouter = createTRPCRouter({

    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                return await ctx.prisma.webhook.findMany({
                    where: {
                        workspaceId: ctx.session.user.workspaceId
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "could not get webhooks, please try again later.",
                });
            }
        }),

    create: protectedProcedure
        .input(ZAddWebhook)
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma.webhook.create({
                    data: {
                        url: input.url,
                        name: input.name,
                        secret: input.secret,
                        events: input.events,
                        createdById: ctx.session.user.id,
                        workspaceId: ctx.session.user.workspaceId,
                    },
                });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "could not create webhook, please try again later.",
                });
            }

        }),
    delete: protectedProcedure
        .input(ZDeleteWebhook)
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma.webhook.delete({
                    where: {
                        id: input.id,
                        workspaceId: ctx.session.user.workspaceId
                    },
                });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "could not delete webhook, please try again later.",
                });
            }
        }),

    disable: protectedProcedure
        .input(ZDisableWebhook)
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma.webhook.update({
                    where: {
                        id: input.id,
                        workspaceId: ctx.session.user.workspaceId
                    },
                    data: {
                        enabled: false,
                    },
                });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "could not disable webhook, please try again later.",
                });
            }
        }),

    enable: protectedProcedure
        .input(ZEnableWebhook)
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma.webhook.update({
                    where: {
                        id: input.id,
                        workspaceId: ctx.session.user.workspaceId
                    },
                    data: {
                        enabled: true,
                    },
                });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "could not enable webhook, please try again later.",
                });
            }
        }),

    update: protectedProcedure
        .input(ZUpdateWebhook)
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma.webhook.update({
                    where: {
                        id: input.id,
                        workspaceId: ctx.session.user.workspaceId
                    },
                    data: {
                        url: input.url,
                        name: input.name,
                        secret: input.secret,
                        events: input.events,
                    },
                });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "could not update webhook, please try again later.",
                });
            }
        }),


});
