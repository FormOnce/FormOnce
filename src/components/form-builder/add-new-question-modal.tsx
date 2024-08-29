'use client'

import React from 'react'
import { type TQuestion } from '~/types/question.types'

import { Dialog, DialogContent } from '@components/ui'
import { AddNewQuestion } from './add-new-question'

type TAddNewQuestionDialogProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addQuestion: (values: TQuestion) => Promise<void>
}

const AddNewQuestionDialog = ({
  isOpen,
  setIsOpen,
  addQuestion,
}: TAddNewQuestionDialogProps) => {
  const onAddQuestion = async (values: TQuestion) => {
    await addQuestion(values)
  }

  const onOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <AddNewQuestion onAddQuestion={onAddQuestion} />
      </DialogContent>
    </Dialog>
  )
}

export { AddNewQuestionDialog }
