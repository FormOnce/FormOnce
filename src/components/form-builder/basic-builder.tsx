import { Form, FormStatus } from '@prisma/client'
import { LockClosedIcon } from '@radix-ui/react-icons'
import { Reorder } from 'framer-motion'
import { TFormSchema } from '~/types/form.types'
import { TQuestion } from '~/types/question.types'
import {
  Button,
  Icons,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
} from '../ui'
import { AddNewQuestion } from './add-new-question'
import { EditableQuestion } from './editable-question'
import { Preview } from './preview'

type BasicBuilderProps = {
  questions: TQuestion[]
  formData: Form | undefined
  isAddingQuestion: boolean
  isCreatingForm: boolean
  isUnpublishingForm: boolean
  currentQuestion: number
  onAddQuestion: (values: TQuestion) => Promise<void>
  onEditQuestion: (question: TQuestion) => Promise<void>
  onDeleteQuestion: (questionId: string) => Promise<void>
  reorderQuestions: (questions: TQuestion[]) => Promise<void>
  setCurrentQuestion: (index: number) => void
  onTogglePublish: () => void
}

export const BasicBuilder = ({
  questions,
  formData,
  isAddingQuestion,
  isCreatingForm,
  isUnpublishingForm,
  currentQuestion,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  reorderQuestions,
  setCurrentQuestion,
  onTogglePublish,
}: BasicBuilderProps) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={40} maxSize={60} className="relative h-full">
        <div
          className={`${
            formData?.status === FormStatus.PUBLISHED
              ? 'absolute left-0 top-0 z-10 flex h-full w-full cursor-not-allowed items-center justify-center bg-black bg-opacity-75'
              : 'hidden'
          }`}
        >
          <div className="mb-28 flex flex-col gap-2">
            <div className="flex">
              <LockClosedIcon className="mr-2 h-6 w-6" />
              <p className="text-xl">Published forms can&apos;t be edited.</p>
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => void onTogglePublish()}
                variant={'destructive'}
                disabled={
                  !formData?.questions.length ||
                  isUnpublishingForm ||
                  formData?.status !== FormStatus.PUBLISHED
                }
                loading={isUnpublishingForm}
              >
                Unpublish
              </Button>
            </div>
          </div>
        </div>
        <ScrollArea className="h-full pr-8">
          <div className="flex h-full flex-col gap-6">
            <Reorder.Group
              onReorder={reorderQuestions}
              values={questions}
              className="flex flex-col gap-4"
            >
              {questions.map((question, index: number) => {
                return (
                  <Reorder.Item
                    key={question.id}
                    value={question}
                    className="flex items-center justify-between gap-4"
                  >
                    <EditableQuestion
                      key={index}
                      editQuestion={onEditQuestion}
                      deleteQuestion={onDeleteQuestion}
                      {...question}
                      index={index}
                      setCurrentQuestion={setCurrentQuestion}
                    />
                  </Reorder.Item>
                )
              })}
            </Reorder.Group>
            {isAddingQuestion || isCreatingForm ? (
              <div className="flex items-center justify-center p-1">
                <Icons.spinner className="mr-3 h-5 w-5 animate-spin" />
              </div>
            ) : null}
            <AddNewQuestion onAddQuestion={onAddQuestion} />
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="flex flex-col gap-4 p-4">
          <Preview
            formSchema={formData?.formSchema as TFormSchema}
            currentQuestionIdx={currentQuestion}
            questions={formData?.questions as TQuestion[]}
          />
          <p className="text-center text-muted-foreground">Preview</p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
