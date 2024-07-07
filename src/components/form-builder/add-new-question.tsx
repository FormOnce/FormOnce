'use client'

import React from 'react'
import {
  EQuestionType,
  ESelectSubType,
  ETextSubType,
  type TQuestion,
} from '~/types/question.types'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icons,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui'
import { SelectQuestionForm } from './select-question-form'
import { TextQuestionForm } from './text-question-form'

type TAddNewQuestionProps = {
  onAddQuestion: (values: TQuestion) => Promise<void>
}

const a = Object.values(ETextSubType).map((value) => ({
  label: value,
  value: `${EQuestionType.Text}:${value}`,
}))

const b = Object.values(ESelectSubType).map((value) => ({
  label: value,
  value: `${EQuestionType.Select}:${value}`,
}))

const questionSubTypes = [...a, ...b]

const AddNewQuestion = (props: TAddNewQuestionProps) => {
  const [inputType, setInputType] = React.useState<EQuestionType>(
    EQuestionType.Text,
  )

  const onInputTypeChange = (value: ETextSubType | ESelectSubType) => {
    const [type] = value.split(':')
    setInputType(type as EQuestionType)
  }

  const onAddQuestion = async (values: TQuestion) => {
    await props.onAddQuestion({ ...values, type: inputType } as TQuestion)
  }

  return (
    <div>
      <div className="flex justify-end relative">
        <div className="w-36 absolute top-2">
          <Select
            onValueChange={onInputTypeChange}
            defaultValue={`${EQuestionType.Text}:${ETextSubType.FreeText}`}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an input type" />
            </SelectTrigger>
            <SelectContent>
              {questionSubTypes.map(
                (type) =>
                  type && (
                    <SelectItem key={type.label} value={type.value}>
                      <div className="px-2 capitalize">{type.label}</div>
                    </SelectItem>
                  ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        {inputType === EQuestionType.Text && (
          <TextQuestionForm onSubmit={onAddQuestion} mode="add" />
        )}
        {inputType === EQuestionType.Select && (
          <SelectQuestionForm onSubmit={onAddQuestion} mode="add" />
        )}
      </div>
    </div>
  )
}

export { AddNewQuestion }
