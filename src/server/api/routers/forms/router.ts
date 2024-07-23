import {
  type Form,
  type FormResponse,
  type FormViews,
  type Prisma,
  WebhookTriggerEvent,
} from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import type { TFormSchema } from '~/types/form.types'
import { ELogicCondition, TLogic, type TQuestion } from '~/types/question.types'
import { ZAddQuestion } from './dtos/addQuestion'
import { ZCreateForm } from './dtos/createForm'
import { ZEditQuestion } from './dtos/editQuestion'
import { ZUpdateForm } from './dtos/updateForm'
import { questionToJsonSchema } from './helpers/questionToJsonSchema'

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
    .input(z.object({ workspaceId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.form.findMany({
          where: {
            workspaceId: input.workspaceId ?? ctx.session?.user?.workspaceId,
          },
          include: {
            author: {
              select: {
                name: true,
                email: true,
                id: true,
              },
            },
            FormResponses: true,
          },
          orderBy: {
            createdAt: 'desc',
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
    .input(
      z.object({
        id: z.string(),
        includeResponses: z.boolean().optional(),
        includeViews: z.boolean().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        type TResponse = {
          form?: Form
          FormResponses?: (FormResponse & {
            FormViews: FormViews
          })[]
          FormViews?: FormViews[]
        }

        const response: TResponse = {}

        const form = await ctx.prisma.form.findUniqueOrThrow({
          where: {
            id: input.id,
            workspaceId: ctx.session?.user?.workspaceId,
          },
          include: {
            author: {
              select: {
                name: true,
                email: true,
                id: true,
              },
            },
          },
        })

        response.form = form

        if (input.includeResponses) {
          const formResponses = await ctx.prisma.formResponse.findMany({
            where: {
              formId: input.id,
            },
            include: {
              FormViews: true,
            },
            orderBy: {
              completed: 'desc',
            },
          })
          response.FormResponses = formResponses
        }

        if (input.includeViews) {
          const formViews = await ctx.prisma.formViews.findMany({
            where: {
              formId: input.id,
            },
            orderBy: {
              createdAt: 'desc',
            },
          })
          response.FormViews = formViews
        }

        return response
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }
    }),
  create: protectedProcedure
    .input(ZCreateForm)
    .mutation(async ({ ctx, input }) => {
      try {
        const formSchema: TFormSchema = {
          type: 'object',
          properties: {},
          required: [],
        }

        const questions: TQuestion[] = []

        input.questions.forEach((question, i) => {
          // const questionId = crypto.randomUUID();
          const questionId = question.title.toLowerCase().replace(/ /g, '_')
          const jsonSchema = questionToJsonSchema(question)

          if (jsonSchema !== null) {
            formSchema.properties = {
              ...formSchema.properties,
              [questionId]: jsonSchema,
            }

            formSchema.required.push(questionId)

            questions.push({
              ...question,
              id: questionId,
              position: {
                x: 400 * i,
                y: 100,
              },
              logic: [
                {
                  questionId,
                  condition:
                    question.type === 'select'
                      ? ELogicCondition.IS_ONE_OF
                      : ELogicCondition.ALWAYS,
                  value: question.type === 'select' ? question.options : '',
                  skipTo: 'end',
                },
              ],
            })
          }
        })

        return await ctx.prisma.form.create({
          data: {
            workspaceId: ctx.session?.user?.workspaceId,
            authorId: ctx.session?.user?.id,
            name: input.name,
            formSchema: formSchema as unknown as string,
            questions: questions,
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

  update: protectedProcedure
    .input(ZUpdateForm)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.form.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            formSchema: input.formSchema,
            questions: input.questions,
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

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.form.delete({
          where: {
            id: input.id,
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

  addQuestion: protectedProcedure
    .input(ZAddQuestion)
    .mutation(async ({ ctx, input }) => {
      try {
        const form = await ctx.prisma.form.findUnique({
          where: {
            id: input.formId,
          },
        })

        if (!form) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Form not found',
          })
        }

        // generate a new question id
        // const questionId = crypto.randomUUID();
        const questionId = input.question.title.toLowerCase().replace(/ /g, '_')

        // 1. convert question to a jsonSchema object
        const jsonSchema = questionToJsonSchema(input.question)

        // 2. update formSchema & questions array
        const questions = form.questions as TQuestion[]

        // 2.1 calculate the position of the new question
        const targetIdx = input.targetIdx ?? questions.length
        const newQuestion = {
          ...input.question,
          id: questionId,
          position: {
            x:
              questions[targetIdx]?.position?.x! ||
              questions[targetIdx - 1]?.position?.x! + 600 ||
              600,
            y:
              questions[targetIdx]?.position?.y! ||
              questions[targetIdx - 1]?.position?.y! ||
              100,
          },
          logic: [
            {
              questionId,
              condition:
                input.question.type === 'select'
                  ? ELogicCondition.IS_ONE_OF
                  : ELogicCondition.ALWAYS,
              value:
                input.question.type === 'select' ? input.question.options : '',
              skipTo: input.targetQuestionId,
            },
          ],
        }

        // 2.2 insert the new question at the targetIdx
        questions.splice(targetIdx, 0, newQuestion)

        // 3. shift the position of the questions after the targetIdx
        for (let i = targetIdx + 1; i < questions.length; i++) {
          questions[i]!.position = {
            x: questions[i]?.position?.x! + 600,
            y: questions[i]?.position?.y!,
          }
        }

        // update logic in the source question
        if (input.sourceLogic) {
          for (const question of questions) {
            if (question.id === input.sourceLogic.questionId) {
              if (question.type === 'select') {
                // remove the values that are in the sourceLogic from the existing logics
                const updatedLogic: TLogic[] = question
                  .logic!.map((l) => {
                    const exisitingValues = l.value as string[]

                    const newValues = exisitingValues.filter(
                      (v) => !input.sourceLogic!.value.includes(v),
                    )

                    if (newValues.length === 0) {
                      return undefined
                    }

                    return {
                      ...l,
                      value: newValues,
                    }
                  })
                  .filter((l) => l !== undefined)

                updatedLogic.push({
                  ...input.sourceLogic,
                  skipTo: questionId,
                })

                question.logic = updatedLogic
              } else {
                question.logic = [
                  {
                    ...input.sourceLogic,
                    skipTo: questionId,
                  },
                ]
              }
            }
          }
        }

        const formSchema = form.formSchema as TFormSchema
        if (jsonSchema !== null) {
          formSchema.properties = {
            ...formSchema.properties,
            [questionId]: jsonSchema,
          }
        }

        formSchema.required = [...formSchema.required, questionId]

        // 3. update the form with the new formSchema & updated questions
        return await ctx.prisma.form.update({
          where: {
            id: input.formId,
          },
          data: {
            formSchema: formSchema as unknown as string,
            questions,
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

  editQuestion: protectedProcedure
    .input(ZEditQuestion)
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await ctx.prisma.form.findUnique({
          where: {
            id: input.formId,
            workspaceId: ctx.session?.user?.workspaceId,
          },
        })

        if (!form) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              "Form not found or you don't have permission to edit this form",
          })
        }

        const questions = form.questions as TQuestion[]
        const questionIndex = questions.findIndex(
          (q) => q.id === input.question.id,
        )

        if (questionIndex === -1) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              "Question not found or you don't have permission to edit this question",
          })
        }

        questions[questionIndex] = {
          ...questions[questionIndex],
          ...input.question,
        }

        // update formSchema
        const formSchema = form.formSchema as TFormSchema
        const jsonSchema = questionToJsonSchema(input.question)

        if (jsonSchema !== null) {
          formSchema.properties = {
            ...formSchema.properties,
            [input.question.id]: jsonSchema,
          }
        } else {
          delete formSchema.properties?.[input.question.id]
          formSchema.required = formSchema.required.filter(
            (id) => id !== input.question.id,
          )
        }

        return await ctx.prisma.form.update({
          where: {
            id: input.formId,
          },
          data: {
            questions,
            formSchema: formSchema as unknown as string,
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

  deleteQuestion: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
        questionId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await ctx.prisma.form.findUnique({
          where: {
            id: input.formId,
            workspaceId: ctx.session?.user?.workspaceId,
          },
        })

        if (!form) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              "Form not found or you don't have permission to edit this form",
          })
        }

        const questions = form.questions as TQuestion[]
        const questionIndex = questions.findIndex(
          (q) => q.id === input.questionId,
        )

        if (questionIndex === -1) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              "Question not found or you don't have permission to edit this question",
          })
        }

        questions.splice(questionIndex, 1)

        const formSchema = form.formSchema as TFormSchema
        delete formSchema.properties![input.questionId]
        formSchema.required = formSchema.required.filter(
          (id) => id !== input.questionId,
        )

        return await ctx.prisma.form.update({
          where: {
            id: input.formId,
          },
          data: {
            questions,
            formSchema: formSchema as unknown as string,
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

  publish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const link = `https://formonce.in/forms/${input.id}`
        return await ctx.prisma.form.update({
          where: {
            id: input.id,
          },
          data: {
            status: 'PUBLISHED',
            link: link,
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
  unpublish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.form.update({
          where: {
            id: input.id,
          },
          data: {
            status: 'DRAFT',
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

  // public procedure to get formData for a form, used to render the live forms
  getPublicFormData: publicProcedure
    .input(
      z.object({
        id: z.string(),
        increaseViewCount: z.boolean().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const form = await ctx.prisma.form.findUnique({
          where: {
            id: input.id,
            status: 'PUBLISHED',
          },
          select: {
            formSchema: true,
            questions: true,
            name: true,
          },
        })

        let formView = undefined
        if (input.increaseViewCount) {
          const ZIpSchema = z.string().ip()

          const parsedIp = ZIpSchema.safeParse(
            ctx.req.headers['x-forwarded-for'] ?? ctx.req.socket.remoteAddress,
          )

          const ip = parsedIp.success ? parsedIp.data : undefined
          const userAgent = ctx.req.headers['user-agent']

          formView = await ctx.prisma.formViews.create({
            data: {
              formId: input.id,
              ip: ip,
              userAgent: userAgent,
            },
          })
        }

        return { form, formViewId: formView?.id }
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }
    }),

  // public procedure to submit a response to a form
  submitResponse: publicProcedure
    .input(
      z.object({
        formId: z.string(),
        response: z.object({}).passthrough(),
        formViewId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const formresponse = await ctx.prisma.formResponse.create({
          data: {
            formId: input.formId,
            response: input.response,
            completed: new Date().toISOString(),
            formViewsId: input.formViewId,
          },
          include: {
            Forms: true,
          },
        })

        // execute webhook
        const webhooks = await ctx.prisma.webhook.findMany({
          where: {
            workspaceId: ctx.session?.user?.workspaceId,
            enabled: true,
            events: {
              has: WebhookTriggerEvent.RESPONSE_SUBMITTED,
            },
          },
        })

        if (webhooks.length > 0) {
          const payload = {
            form: formresponse.Forms.name,
            formId: input.formId,
            event: WebhookTriggerEvent.RESPONSE_SUBMITTED,
            response: input.response,
            submittedAt: formresponse.completed?.toISOString(),
          }
          webhooks.forEach(async (webhook) => {
            const response = await fetch(webhook.url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-FormOnce-Secret': webhook.secret,
              },
              body: JSON.stringify(payload),
            })

            if (response.ok) {
              console.log('Webhook sent successfully')
            } else {
              console.log('Webhook failed to send')
            }

            const responseText = await response.text()
            let responseBody: Prisma.InputJsonValue

            try {
              responseBody = JSON.parse(responseText) as Prisma.InputJsonValue
            } catch (error) {
              responseBody = responseText
            }

            // create WebhookRecord
            await ctx.prisma.webhookRecord.create({
              data: {
                // formId: input.formId,
                webhookId: webhook.id,
                event: WebhookTriggerEvent.RESPONSE_SUBMITTED,
                payload: payload,
                responseBody: responseBody,
                responseStatus: response.status,
                responseHeaders: Object.fromEntries(response.headers.entries()),
              },
            })
          })
        }

        return formresponse
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        })
      }
    }),
})
