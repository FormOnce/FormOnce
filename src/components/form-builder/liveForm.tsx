import React from 'react'
import type { TFormSchema } from '~/types/form.types'
import type { TQuestion } from '~/types/question.types'

import { api } from '~/utils/api'
import FormRenderer from './form-renderer'

type TLiveFormProps = {
  formId: string
  formSchema: TFormSchema
  questions: TQuestion[]
  formViewId: string
}

function LiveForm({
  formId,
  formSchema,
  questions,
  formViewId,
}: TLiveFormProps) {
  const { mutateAsync: submitResponse, isSuccess: formSubmitted } =
    api.form.submitResponse.useMutation()

  const onNext = () => {
    console.log('next')
  }

  const onPrev = () => {
    console.log('prev')
  }

  const onSubmit = async (values: Record<string, unknown>) => {
    await submitResponse({
      formId: formId,
      response: values,
      formViewId,
    })
  }

  if (formSubmitted) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text text-4xl font-bold">Form submitted 🎉</div>
        <div className="text text-lg font-thin">
          Your response has been submitted successfully.
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border px-8 py-16 pt-4">
      <FormRenderer
        formSchema={formSchema}
        questions={questions}
        onNext={onNext}
        onPrev={onPrev}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export { LiveForm }
