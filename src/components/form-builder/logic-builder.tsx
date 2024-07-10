import { MoveRight } from 'lucide-react'
import { useState } from 'react'
import {
  ELogicCondition,
  EQuestionType,
  ETextSubType,
  TLogic,
  TQuestion,
  TSelectQuestion,
} from '~/types/question.types'
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui'

type LogicBuilderProps = {
  sourceQuestion: TQuestion
  open: boolean
  setIsOpen: (open: boolean) => void
  onAddLogic: (logic: TLogic) => void
}

export const LogicBuilderDialog = (props: LogicBuilderProps) => {
  const questionType = props.sourceQuestion?.type

  return (
    <Dialog open={props.open} onOpenChange={props.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose condition</DialogTitle>
          <DialogDescription>
            When should control jump to this question?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form className="flex flex-col gap-2 p-10 ">
            <Button
              className="w-full"
              onClick={() =>
                props.onAddLogic({
                  questionId: 'test',
                  condition: ELogicCondition.ALWAYS,
                  value: '',
                  skipTo: '',
                })
              }
            >
              Always
            </Button>
            <div className="flex items-center gap-2">
              <div className="border w-full" />
              <span className="text-neutral-300">or</span>
              <div className="border w-full" />
            </div>
            {questionType === EQuestionType.Select && (
              <SelectLogicBuilder options={props.sourceQuestion.options} />
            )}
            {questionType === EQuestionType.Text && <TextLogicBuilder />}
            <Button size={'lg'}>
              Continue <MoveRight size={24} className="ml-2" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const TextLogicBuilder = () => {
  return (
    <div className="grid gap-4 py-4">
      <form className="flex flex-col">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Is</label>
          <select
            className="form-select"
            name="condition"
            id="condition"
            required
          >
            <option value={ELogicCondition.IS}>Is</option>
            <option value={ELogicCondition.IS_NOT}>Is not</option>
            <option value={ELogicCondition.CONTAINS}>Contains</option>
            <option value={ELogicCondition.DOES_NOT_CONTAIN}>
              Does not contain
            </option>
          </select>
        </div>
      </form>
    </div>
  )
}

type SelectLogicBuilderProps = {
  options: TSelectQuestion['options']
}

const SelectLogicBuilder = (props: SelectLogicBuilderProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('')

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
  }

  return (
    <div className="grid gap-4 py-4">
      {props.options.map((option, i) => (
        <div
          key={i}
          onClick={() => handleOptionClick(option)}
          className="flex gap-2 border p-2 px-4 rounded-md text-sm justify-between items-center cursor-pointer"
        >
          <div className="flex gap-2">
            <span>{i + 1}</span>
            <span>{option}</span>
          </div>
          <Checkbox checked={option === selectedOption} />
        </div>
      ))}
    </div>
  )
}

const getLogicOptions = (
  questionType: TQuestion['type'],
  questionSubType: TQuestion['subType'],
) => {
  switch (questionType) {
    case EQuestionType.Text:
      switch (questionSubType) {
        case ETextSubType.FreeText:
          return [
            { label: 'Is', value: ELogicCondition.IS },
            { label: 'Is not', value: ELogicCondition.IS_NOT },
            { label: 'Contains', value: ELogicCondition.CONTAINS },
            {
              label: 'Does not contain',
              value: ELogicCondition.DOES_NOT_CONTAIN,
            },
          ]
        default:
          return []
      }
    default:
      return []
  }
}
