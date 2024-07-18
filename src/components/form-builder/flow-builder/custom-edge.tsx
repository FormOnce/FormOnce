import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  getBezierPath,
  useReactFlow,
} from 'reactflow'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui'
import { TLogic, TQuestion } from '~/types/question.types'
import { api } from '~/utils/api'
import { AddNewQuestionDialog } from '../add-new-question-modal'
import { LogicBuilderDialog } from './logic-builder-dialog'

type CustomEdgeProps = {
  id: string
  data?: {
    formId: string
    refreshFormData: () => void
  }
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
}

export default function CustomeEdge({
  id,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: CustomEdgeProps) {
  const router = useRouter()

  const { mutateAsync: addQuestion } = api.form.addQuestion.useMutation()
  const { mutateAsync: createForm } = api.form.create.useMutation()

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  })

  const [addQuestionDialogOpen, setAddQuestionDialogOpen] = useState(false)
  const [logicBuilderDialogOpen, setLogicBuilderDialogOpen] = useState(false)

  // used to update the source node's logic while adding new question
  const [sourceLogic, setSourceLogic] = useState<TLogic | null>(null)

  const reactFlowInstance = useReactFlow()

  const onEdgeClick = () => {
    const edge = reactFlowInstance.getEdge(id)

    const targetNode = edge?.target ? { id: edge.target } : null
    const sourceNode = edge?.source ? { id: edge.source } : null

    if (!targetNode || !sourceNode) return

    reactFlowInstance.fitView({
      nodes: [sourceNode, targetNode],
      padding: 100,
      duration: 500,
      minZoom: 0.7,
    })
  }

  const onAddNode = () => {
    onEdgeClick()
    setLogicBuilderDialogOpen(true)
  }

  const onAddLogic = (values: TLogic) => {
    setSourceLogic(values)
    setAddQuestionDialogOpen(true)
    setLogicBuilderDialogOpen(false)
  }

  const onAddQuestion = async (values: TQuestion) => {
    if (!data) return

    // 1. get the edge's source node
    const edge = reactFlowInstance.getEdge(id)
    const sourceNode = edge?.source
      ? reactFlowInstance.getNode(edge.source)
      : null

    if (!sourceNode) return

    // 2. get the index of the source node
    const sourceNodeIdxStr = sourceNode.data.label.split('.')[0] ?? '0'
    const sourceNodeIdx = parseInt(sourceNodeIdxStr) || 0

    // if formId is new, create form first
    if (data.formId === 'new') {
      await createForm({
        name: 'New Form',
        questions: [values],
      }).then((res) => {
        void router.push(`/dashboard/forms/${res.id}`)
      })
      return
    }

    // else add question to form
    await addQuestion({
      formId: data.formId,
      question: values,
      targetIdx: sourceNodeIdx,
      sourceLogic: sourceLogic ? [sourceLogic] : undefined,
    }).then(() => {
      void data.refreshFormData()
    })

    setSourceLogic(null)
    setAddQuestionDialogOpen(false)
  }

  const sourceNode = reactFlowInstance.getNode(
    reactFlowInstance.getEdge(id)?.source!,
  )

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <TooltipProvider>
          <Tooltip delayDuration={10}>
            <TooltipContent sideOffset={10}>
              <p className="text-xl p-1">Add new question here</p>
            </TooltipContent>
            <TooltipTrigger
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: 'all',
              }}
            >
              <Button
                variant={'secondary'}
                size={'icon'}
                className="nodrag nopan rounded-full [&>*]:hover:scale-100 hover:border-4 border-green-600 ring-black"
                onClick={onAddNode}
              >
                <Plus size={24} />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      </EdgeLabelRenderer>
      <LogicBuilderDialog
        open={logicBuilderDialogOpen}
        setIsOpen={setLogicBuilderDialogOpen}
        sourceQuestion={sourceNode?.data.question as TQuestion & { id: string }}
        onAddLogic={onAddLogic}
      />

      <AddNewQuestionDialog
        isOpen={addQuestionDialogOpen}
        setIsOpen={setAddQuestionDialogOpen}
        addQuestion={onAddQuestion}
      />
    </>
  )
}
