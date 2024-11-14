import { MessageSquare, MoreVertical, Play, Split, Video } from 'lucide-react'
import { memo, useMemo, useState } from 'react'
import { Handle, Position, useReactFlow } from 'reactflow'
import { Button } from '~/components/ui'
import { TLogic, TQuestion } from '~/types/question.types'
import { api } from '~/utils/api'
import { EditableQuestionDialog } from '../editable-question-modal'
import { VideoUploadDialog } from './VideoUploadDialog'
import { EditQuestion as EditNode } from './edit-question'
import { handleStyleLeft, handleStyleRight } from './utils'

type QuestionNodeProps = {
  data: {
    question: TQuestion
    label: string
    formId: string
    refreshFormData: () => void
  }
}

const QuestionNode = ({ data }: QuestionNodeProps) => {
  const { question, label } = data

  const reactFlowInstance = useReactFlow()
  const questionNode = reactFlowInstance.getNode(question.id!)

  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [editQuestionNodeOpen, setEditQuestionNodeOpen] = useState(false)
  const [editQuestionNodeMode, setEditQuestionNodeMode] = useState<
    'video' | 'logic' | 'answer'
  >('video')

  const [videoDialogOpen, setVideoDialogOpen] = useState(false)

  const { mutateAsync: editQuestion } = api.form.editQuestion.useMutation()

  const onEdit = async (values: TQuestion) => {
    await editQuestion({
      formId: data.formId,
      question: {
        ...values,
        id: question.id!,
      },
    })
    data.refreshFormData()
    setEditDialogOpen(false)
  }

  const openEditDialog = () => {
    setEditDialogOpen(true)
  }

  const openVideoDialog = () => {
    setVideoDialogOpen(true)
  }

  const onCloseEditQuestionNode = () => {
    setEditQuestionNodeOpen(false)
  }

  const onEditQuestionNode = (mode: 'video' | 'logic' | 'answer') => {
    setEditQuestionNodeMode(mode)
    setEditQuestionNodeOpen(true)
  }

  const onUpdateLogic = async (values: TLogic[]) => {
    const updatedQuestion = {
      ...questionNode!.data.question,
      logic: values,
    }

    await editQuestion({
      formId: data.formId,
      question: updatedQuestion,
    }).then(() => {
      data.refreshFormData()
    })
  }

  return (
    <div className="relative group">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <ToolBar
          onVideo={() => onEditQuestionNode('video')}
          onAnswer={() => onEditQuestionNode('answer')}
          onLogic={() => onEditQuestionNode('logic')}
        />
      </div>
      <div className="flex flex-col border-2 border-violet-800 hover:border-violet-500 [&>div:first-child]:hover:border-violet-500 rounded-lg bg-primary-foreground w-64 h-56 hover:scale-105 transition-all duration-200">
        <div className="px-4 py-2 bg-primary-foreground rounded-t-lg border-b-2  border-violet-800">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            {label}
          </p>
        </div>
        <div className="flex h-full rounded-b-lg">
          <div
            className="w-1/2 h-full rounded-bl-lg bg-black opacity-50 hover:opacity-100 flex justify-center items-center border-r border-violet-500 [&>*:first-child]:hover:bg-violet-800 [&>*:first-child]:hover:text-white [&>*:first-child]:hover:h-10 [&>*:first-child]:hover:w-10"
            onClick={openVideoDialog}
          >
            <Button
              variant={'secondary'}
              size={'icon'}
              className="rounded-full p-2 hover:w-10 hover:h-10 hover:bg-violet-800 hover:text-white"
            >
              <Play size={32} className="text-violet-300 ml-0.5" />
            </Button>
          </div>
          <div
            className="w-1/2 h-full flex flex-col justify-center items-center gap-4 [&>button]:hover:bg-violet-600 cursor-pointer"
            onClick={openEditDialog}
          >
            <Button variant={'secondary'} size={'sm'} className="w-[70%] h-5" />
            <Button variant={'secondary'} size={'sm'} className="w-[70%] h-5" />
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          style={handleStyleRight}
        />
        <Handle
          type="target"
          position={Position.Left}
          style={handleStyleLeft}
        />
        <EditableQuestionDialog
          {...question}
          isOpen={editDialogOpen}
          setIsOpen={setEditDialogOpen}
          editQuestion={onEdit}
        />
        <VideoUploadDialog
          isOpen={videoDialogOpen}
          setIsOpen={setVideoDialogOpen}
        />
      </div>
      {questionNode && (
        <EditNode
          isOpen={editQuestionNodeOpen}
          onEdit={onEdit}
          onClose={onCloseEditQuestionNode}
          editingNode={questionNode}
          onUpdateLogic={onUpdateLogic}
          defaultMode={editQuestionNodeMode}
        />
      )}
    </div>
  )
}

export default memo(QuestionNode)

type ToolBarProps = {
  onVideo: () => void
  onAnswer: () => void
  onLogic: () => void
}

const ToolBar = ({ onVideo, onAnswer, onLogic }: ToolBarProps) => {
  return (
    <div className="flex gap-2 bg-primary-foreground rounded-lg">
      <Button variant={'ghost'} size={'lg'} className="h-max" onClick={onVideo}>
        <div className="flex flex-col items-center gap-2">
          <Video size={36} fill="white" />
          Video
        </div>
      </Button>
      <Button
        variant={'ghost'}
        size={'lg'}
        className="h-max"
        onClick={onAnswer}
      >
        <div className="flex flex-col items-center gap-2 text-sm">
          <MessageSquare size={36} />
          Answer
        </div>
      </Button>
      <Button variant={'ghost'} size={'lg'} className="h-max" onClick={onLogic}>
        <div className="flex flex-col items-center gap-2 text-sm">
          <Split size={36} />
          Logic
        </div>
      </Button>
      <Button
        variant={'ghost'}
        size={'lg'}
        className="h-max border-l rounded-l-none"
      >
        <div className="flex flex-col items-center gap-2 text-sm">
          <MoreVertical size={36} />
          More
        </div>
      </Button>
    </div>
  )
}
