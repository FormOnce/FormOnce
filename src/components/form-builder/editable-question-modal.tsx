'use client'

import React from 'react'
import { EQuestionType, type TQuestion } from '~/types/question.types'

import { Dialog, DialogContent } from '@components/ui'
import { SelectQuestionForm } from './select-question-form'
import { TextQuestionForm } from './text-question-form'

type TEditableQuestionDialogProps = TQuestion & {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  editQuestion: (values: TQuestion) => Promise<void>
}

const EditableQuestionDialog = ({
  isOpen,
  setIsOpen,
  editQuestion,
  ...question
}: TEditableQuestionDialogProps) => {
  const onEditQuestion = async (values: TQuestion) => {
    await editQuestion({
      ...values,
      id: question.id,
    } as TQuestion)
  }

  const onOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        {question.type === EQuestionType.Text && (
          <TextQuestionForm onEdit={onEditQuestion} mode="edit" {...question} />
        )}
        {question.type === EQuestionType.Select && (
          <SelectQuestionForm
            onEdit={onEditQuestion}
            mode="edit"
            {...question}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export { EditableQuestionDialog }
