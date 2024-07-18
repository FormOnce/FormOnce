import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui'
import { TLogic } from '~/types/question.types'
import { LogicBuilder, LogicBuilderProps } from './logic-builder'

type LogicBuilderDialogProps = LogicBuilderProps & {
  open: boolean
  setIsOpen: (open: boolean) => void
}

export const LogicBuilderDialog = ({
  open,
  setIsOpen,
  ...logicBuilerProps
}: LogicBuilderDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logic builder</DialogTitle>
          <DialogDescription>
            Choose the option(s) that will jump to this question
          </DialogDescription>
        </DialogHeader>
        <LogicBuilder {...logicBuilerProps} />
      </DialogContent>
    </Dialog>
  )
}
