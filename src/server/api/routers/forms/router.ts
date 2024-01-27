import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { ZCreateForm } from "./dtos/createForm";
import { ZUpdateForm } from "./dtos/updateForm";
import { z } from "zod";
import { ZAddQuestion } from "./dtos/addQuestion";
import type { TFormSchema } from "~/types/form.types";
import { questionToJsonSchema } from "./helpers/questionToJsonSchema";
import type { TQuestion } from "~/types/question.types";


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

                const formSchema: TFormSchema = {
                    type: "object",
                    properties: {},
                    required: []
                };

                const questions: TQuestion[] = []

                input.questions.forEach(question => {
                    const questionId = crypto.randomUUID();
                    const jsonSchema = questionToJsonSchema(question);

                    if (jsonSchema !== null) {
                        formSchema.properties = {
                            ...formSchema.properties,
                            [questionId]: jsonSchema
                        }

                        formSchema.required.push(questionId);

                        questions.push({
                            ...question,
                            id: questionId
                        });
                    }
                });

                return await ctx.prisma.form.create({
                    data: {
                        workspaceId: ctx.session?.user?.workspaceId,
                        authorId: ctx.session?.user?.id,
                        name: input.name,
                        formSchema: formSchema as unknown as string,
                        questions: questions
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

    addQuestion: protectedProcedure.input(ZAddQuestion).mutation(async ({ ctx, input }) => {
        try {
            const form = await ctx.prisma.form.findUnique({
                where: {
                    id: input.formId
                }
            });

            if (!form) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Form not found",
                });
            }

            // generate a new question id
            const questionId = crypto.randomUUID();

            // 1. convert question to a jsonSchema object
            const jsonSchema = questionToJsonSchema(input.question);

            // 2. update formSchema & questions array
            const questions = form.questions as TQuestion[];
            questions.push({
                ...input.question,
                id: questionId
            });

            const formSchema = form.formSchema as TFormSchema;
            if (jsonSchema !== null) {
                formSchema.properties = {
                    ...formSchema.properties,
                    [questionId]: jsonSchema,
                };
            }

            formSchema.required = [
                ...formSchema.required,
                questionId
            ]

            // 3. update the form with the new formSchema
            return await ctx.prisma.form.update({
                where: {
                    id: input.formId
                },
                data: {
                    formSchema: formSchema as unknown as string,
                    questions
                }
            });

        } catch (error) {
            console.log(error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong",
            });
        }
    })
});
