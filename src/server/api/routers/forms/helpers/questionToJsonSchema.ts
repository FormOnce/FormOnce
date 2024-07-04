import type {
  TQuestion,
  TSelectQuestion,
  TTextQuestion,
} from '~/types/question.types'

export const questionToJsonSchema = (question: TQuestion) => {
  const { type } = question

  switch (type) {
    case 'text':
      return textQuestionToJsonSchema(question)
    case 'select':
      return selectQuestionToJsonSchema(question)
    default:
      return null
  }
}

const textQuestionToJsonSchema = (question: TTextQuestion) => {
  const { subType, ...rest } = question

  switch (subType) {
    case 'free text':
      return {
        ...rest,
        type: 'string' as const,
        minLength: 1,
        maxLength: 500,
      }

    case 'email':
      return {
        ...rest,
        type: 'string' as const,
        format: 'email',
      }

    case 'number':
      return {
        ...rest,
        type: 'number' as const,
      }

    case 'url':
      return {
        ...rest,
        type: 'string' as const,
        format: 'uri',
      }

    case 'phone':
      return {
        ...rest,
        type: 'string' as const,
        pattern: '^[0-9]{10}$',
      }

    case 'password':
      return {
        ...rest,
        type: 'string' as const,
        minLength: 8,
        maxLength: 100,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
      }

    case 'address':
      return {
        ...rest,
        type: 'string' as const,
        minLength: 1,
        maxLength: 500,
      }

    default:
      return null
  }
}
const selectQuestionToJsonSchema = (question: TSelectQuestion) => {
  const { subType, ...rest } = question

  switch (subType) {
    case 'single':
      return {
        ...rest,
        type: 'array' as const,
        items: {
          type: 'string' as const,
          enum: question.options,
        },
        maxItems: 1,
        minItems: 1,
      }

    case 'multiple':
      return {
        ...rest,
        type: 'array' as const,
        items: {
          type: 'string' as const,
          enum: question.options,
        },
        minItems: 1,
      }

    default:
      return null
  }
}
