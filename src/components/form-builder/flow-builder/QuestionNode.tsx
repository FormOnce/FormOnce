import { MessageSquare, MoreVertical, Play, Split, Video } from 'lucide-react'
import { memo, useState } from 'react'
import { Handle, Position, useReactFlow } from 'reactflow'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui'
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

  // TODO: see if there is better way to do this
  const edges = reactFlowInstance.getEdges()
  const hasIncomingEdge = edges.some((edge) => edge.target === question.id)

  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [editQuestionNodeOpen, setEditQuestionNodeOpen] = useState(false)
  const [editQuestionNodeMode, setEditQuestionNodeMode] = useState<
    'video' | 'logic' | 'answer'
  >('video')

  const [toolBarOpen, setToolBarOpen] = useState(false)

  const [videoDialogOpen, setVideoDialogOpen] = useState(false)

  const { mutateAsync: editQuestion } = api.form.editQuestion.useMutation()
  const { mutateAsync: deleteQuestion } = api.form.deleteQuestion.useMutation()
  const { mutateAsync: duplicateQuestion } =
    api.form.duplicateQuestion.useMutation()

  const onDuplicate = async () => {
    await duplicateQuestion({
      formId: data.formId,
      questionId: question.id!,
    })
    data.refreshFormData()
  }

  const onDelete = async () => {
    await deleteQuestion({
      formId: data.formId,
      questionId: question.id!,
    })
    data.refreshFormData()
  }

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
    if (!questionNode) return

    // zoom out
    reactFlowInstance.fitView({
      nodes: [questionNode],
      padding: 150,
      duration: 500,
      minZoom: 0.7,
    })
    setEditQuestionNodeOpen(false)
  }

  const onEditQuestionNode = (mode: 'video' | 'logic' | 'answer') => {
    if (!questionNode) return

    // Fit view to source node
    reactFlowInstance.fitView({
      nodes: [questionNode],
      padding: 150,
      duration: 500,
      minZoom: 1,
    })

    setToolBarOpen(false)

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
    <div
      className={`relative group ${hasIncomingEdge ? '' : 'opacity-50'}`}
      onMouseEnter={() => setToolBarOpen(true)}
      onMouseLeave={() => setToolBarOpen(false)}
    >
      <div className={`absolute -top-32 left-1/2 -translate-x-1/2`}>
        <ToolBar
          open={toolBarOpen}
          onVideoClick={() => onEditQuestionNode('video')}
          onAnswerClick={() => onEditQuestionNode('answer')}
          onLogicClick={() => onEditQuestionNode('logic')}
          onDelete={onDelete}
          onDuplciate={onDuplicate}
        />
      </div>
      <div
        className={`flex flex-col border-2 border-violet-800 group-hover:border-violet-500 [&>div:first-child]:hover:border-violet-500 rounded-lg bg-primary-foreground w-64 h-56 group-hover:scale-105 transition-all duration-200 ${
          toolBarOpen ? 'scale-105 border-violet-500' : ''
        }`}
      >
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
          onDelete={onDelete}
          onDuplicate={onDuplicate}
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
  open: boolean
  onVideoClick: () => void
  onAnswerClick: () => void
  onLogicClick: () => void

  // NOTE: these will be used in future for hover effects
  // onLogicHoverStart: () => void
  // onLogicHoverStop: () => void
  // onAnswerHoverStart: () => void
  // onAnswerHoverStop: () => void
  // onVideoHoverStart: () => void
  // onVideoHoverStop: () => void

  onDelete: () => Promise<void>
  onDuplciate: () => Promise<void>
}

const ToolBar = ({
  open,
  onVideoClick,
  onAnswerClick,
  onLogicClick,
  onDelete,
  onDuplciate,
  // onAnswerHoverStart,
  // onAnswerHoverStop,
  // onLogicHoverStart,
  // onLogicHoverStop,
  // onVideoHoverStart,
  // onVideoHoverStop
}: ToolBarProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isDuplicateLoading, setIsDuplicateLoading] = useState(false)

  const handleDelete = async () => {
    setIsDeleteLoading(true)
    await onDelete()
    setIsDeleteLoading(false)
  }

  const handleDuplicate = async () => {
    setIsDuplicateLoading(true)
    await onDuplciate()
    setIsDuplicateLoading(false)
  }

  return (
    <div
      className="flex gap-1 bg-primary-foreground rounded-lg items-stretch overflow-hidden transition-opacity duration-200"
      style={{
        opacity: open ? 1 : 0,
      }}
    >
      <div className="flex">
        <Button
          variant={'ghost'}
          size={'lg'}
          className="h-full flex flex-col items-center gap-2 w-fit rounded-none"
          onClick={onVideoClick}
          // onMouseEnter={onVideoHoverStart}
          // onMouseLeave={onVideoHoverStop}
        >
          <Video size={32} fill="white" />
          Video
        </Button>
        <Button
          variant={'ghost'}
          size={'lg'}
          className="h-full flex flex-col items-center gap-2 w-fit rounded-none"
          onClick={onAnswerClick}
          // onMouseEnter={onAnswerHoverStart}
          // onMouseLeave={onAnswerHoverStop}
        >
          <MessageSquare size={32} />
          Answer
        </Button>
        <Button
          variant={'ghost'}
          size={'lg'}
          className="h-full flex flex-col items-center gap-2 w-fit rounded-none"
          onClick={onLogicClick}
          // onMouseEnter={onLogicHoverStart}
          // onMouseLeave={onLogicHoverStop}
        >
          <Split size={32} />
          Logic
        </Button>
      </div>
      <div>
        <Popover>
          <PopoverTrigger className="h-full" asChild>
            <Button
              variant={'ghost'}
              className="h-full flex items-center justify-center border-l-2 rounded-none"
            >
              <MoreVertical size={32} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            side="right"
            className={`p-0 w-36 -translate-x-2 shadow-2xl rounded-lg ${
              open ? '' : 'hidden'
            }`}
          >
            <div className="flex flex-col gap-1 bg-primary-foreground rounded-lg items-stretch overflow-hidden p-2">
              <Button
                variant={'ghost'}
                size={'sm'}
                onClick={handleDuplicate}
                loading={isDuplicateLoading}
                noChildOnLoading
              >
                Duplicate
              </Button>
              <Button
                variant={'ghost'}
                size={'sm'}
                onClick={handleDelete}
                loading={isDeleteLoading}
                noChildOnLoading
                className="hover:text-red-500"
              >
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
