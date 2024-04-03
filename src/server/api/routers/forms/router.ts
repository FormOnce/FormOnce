import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { ZCreateForm } from "./dtos/createForm";
import { ZUpdateForm } from "./dtos/updateForm";
import { z } from "zod";
import { ZAddQuestion } from "./dtos/addQuestion";
import type { TFormSchema } from "~/types/form.types";
import { questionToJsonSchema } from "./helpers/questionToJsonSchema";
import { type TQuestion } from "~/types/question.types";
import { ZEditQuestion } from "./dtos/editQuestion";
import type { Form, FormResponse, FormViews } from "@prisma/client";


/** Index
 * getAll: protectedProcedure - get all forms for a workspace
 * getOne: protectedProcedure - get a single form by id
 * create: protectedProcedure - create a new form
 * update: protectedProcedure - update a form
 * addQuestion: protectedProcedure - add a question to a form
 * publish: protectedProcedure - publish a form
 * unpublish: protectedProcedure - unpublish a form
 * getPublicFormData: publicProcedure - get form data for a form
 * submitResponse: publicProcedure - submit a response to a form
 **/

export const formRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                return await
                    ctx.prisma.form.findMany({
                        where: {
                            workspaceId: ctx.session?.user?.workspaceId ?? null
                        },
                        include: {
                            author: {
                                select: {
                                    name: true,
                                    email: true,
                                    id: true
                                }
                            },
                            FormResponses: true
                        },
                        orderBy: {
                            createdAt: "desc"
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
            id: z.string(),
            includeResponses: z.boolean().optional(),
            includeViews: z.boolean().optional(),
        }))
        .query(async ({ input, ctx }) => {
            try {
                type TResponse = {
                    form?: Form;
                    FormResponses?: (FormResponse & {
                        FormViews: FormViews
                    })[];
                    FormViews?: FormViews[];
                }

                const response: TResponse = {}

                const form = await
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
                        },
                    });

                response.form = form;

                if (input.includeResponses) {
                    const formResponses = await ctx.prisma.formResponse.findMany({
                        where: {
                            formId: input.id
                        },
                        include: {
                            FormViews: true
                        }

                    });
                    response.FormResponses = formResponses;
                }

                if (input.includeViews) {
                    const formViews = await ctx.prisma.formViews.findMany({
                        where: {
                            formId: input.id
                        }
                    });
                    response.FormViews = formViews;
                }

                return response;
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
                    // const questionId = crypto.randomUUID();
                    const questionId = question.title.toLowerCase().replace(/ /g, "_");
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
                        formSchema: input.formSchema,
                        questions: input.questions
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

    delete: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                return await ctx.prisma.form.delete({
                    where: {
                        id: input.id
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
            // const questionId = crypto.randomUUID();
            const questionId = input.question.title.toLowerCase().replace(/ /g, "_")

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
    }),

    editQuestion: protectedProcedure
        .input(ZEditQuestion)
        .mutation(async ({ input, ctx }) => {
            try {
                const form = await ctx.prisma.form.findUnique({
                    where: {
                        id: input.formId,
                        workspaceId: ctx.session?.user?.workspaceId
                    }
                });

                if (!form) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Form not found or you don't have permission to edit this form",
                    });
                }

                const questions = form.questions as TQuestion[];
                const questionIndex = questions.findIndex(q => q.id === input.question.id);

                if (questionIndex === -1) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Question not found or you don't have permission to edit this question",
                    });
                }

                questions[questionIndex] = {
                    ...questions[questionIndex],
                    ...input.question
                }

                return await ctx.prisma.form.update({
                    where: {
                        id: input.formId
                    },
                    data: {
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
        }),

    deleteQuestion: protectedProcedure
        .input(z.object({
            formId: z.string(),
            questionId: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const form = await ctx.prisma.form.findUnique({
                    where: {
                        id: input.formId,
                        workspaceId: ctx.session?.user?.workspaceId
                    }
                });

                if (!form) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Form not found or you don't have permission to edit this form",
                    });
                }

                const questions = form.questions as TQuestion[];
                const questionIndex = questions.findIndex(q => q.id === input.questionId);

                if (questionIndex === -1) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Question not found or you don't have permission to edit this question",
                    });
                }

                questions.splice(questionIndex, 1);

                const formSchema = form.formSchema as TFormSchema;
                delete formSchema.properties![input.questionId];
                formSchema.required = formSchema.required.filter((id) => id !== input.questionId);

                return await ctx.prisma.form.update({
                    where: {
                        id: input.formId
                    },
                    data: {
                        questions,
                        formSchema: formSchema as unknown as string
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

    publish: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const link = `https://form-once.vercel.app/forms/${input.id}`
                return await ctx.prisma.form.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        status: "PUBLISHED",
                        link: link
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
    unpublish: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                return await ctx.prisma.form.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        status: "DRAFT"
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

    // public procedure to get formData for a form, used to render the live forms
    getPublicFormData: publicProcedure
        .input(z.object({
            id: z.string(),
            increaseViewCount: z.boolean().optional()
        }))
        .query(async ({ input, ctx }) => {
            try {
                const form = await ctx.prisma.form.findUnique({
                    where: {
                        id: input.id
                    },
                    select: {
                        formSchema: true,
                        questions: true,
                        name: true
                    }
                });

                let formView = undefined;
                if (input.increaseViewCount) {

                    const ZIpSchema = z.string().ip();

                    const parsedIp = ZIpSchema.safeParse(ctx.req.headers['x-forwarded-for'] ?? ctx.req.socket.remoteAddress);

                    const ip = parsedIp.success ? parsedIp.data : undefined;
                    const userAgent = ctx.req.headers['user-agent'];

                    formView = await ctx.prisma.formViews.create({
                        data: {
                            formId: input.id,
                            ip: ip,
                            userAgent: userAgent
                        }
                    });
                }

                return { form, formViewId: formView?.id };
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong",
                });
            }
        }),

    // public procedure to submit a response to a form
    submitResponse: publicProcedure
        .input(z.object({
            formId: z.string(),
            response: z.object({}).passthrough(),
            formViewId: z.string()
        }))
        .mutation(async ({ input, ctx, }) => {
            try {
                return await ctx.prisma.formResponse.create({
                    data: {
                        formId: input.formId,
                        response: input.response,
                        completed: new Date().toISOString(),
                        formViewsId: input.formViewId,
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
