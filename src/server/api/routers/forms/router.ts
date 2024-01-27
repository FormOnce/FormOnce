import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { ZCreateForm } from "./dtos/createForm";
import { ZUpdateForm } from "./dtos/updateForm";
import { z } from "zod";


/** Index
 * getAll: protectedProcedure - get all forms for a workspace
 **/

export const formRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                return await
                    ctx.prisma.form.findMany({
                        where: {
                            workspaceId: ctx.session?.user?.workspaceId
                        },
                        include: {
                            author: {
                                select: {
                                    name: true,
                                    email: true,
                                    id: true
                                }
                            },
                        }
                    });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong",
                });
            }

        }),
    getOne: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ input, ctx }) => {
            try {
                return await
                    ctx.prisma.form.findUniqueOrThrow({
                        where: {
                            id: input.id,
                            workspaceId: ctx.session?.user?.workspaceId
                        },
                        include: {
                            author: {
                                select: {
                                    name: true,
                                    email: true,
                                    id: true
                                }
                            },
                        }
                    });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong",
                });
            }

        }),
    create: protectedProcedure
        .input(ZCreateForm)
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma.form.create({
                    data: {
                        ...input,
                        workspaceId: ctx.session?.user?.workspaceId,
                        authorId: ctx.session?.user?.id
                    }
                });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong",
                });
            }
        }),

    update: protectedProcedure
        .input(ZUpdateForm)
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.prisma.form.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        name: input.name,
                        formSchema: input.formSchema
                    }
                });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong",
                });
            }
        }),
});
