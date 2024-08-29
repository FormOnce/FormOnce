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
    showLogic: boolean
    logic: TLogic
    setIsEdgeClickBlocked: (isBlocked: boolean) => void
  }
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  style?: React.CSSProperties
}

export default function CustomeEdge({
  id,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
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

  const fitEdgeIntoView = () => {
    data?.setIsEdgeClickBlocked(true)
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
    fitEdgeIntoView()

    if (sourceNode?.id === 'start') {
      setAddQuestionDialogOpen(true)
      return
    }

    setLogicBuilderDialogOpen(true)
  }

  const onAddLogic = (values: TLogic) => {
    setSourceLogic(values)
    setAddQuestionDialogOpen(true)
    setLogicBuilderDialogOpen(false)
    data?.setIsEdgeClickBlocked(false)
  }

  const onAddQuestion = async (values: TQuestion) => {
    if (!data) return

    // 1. get the edge's source node
    const edge = reactFlowInstance.getEdge(id)
    const sourceNode = edge?.source
      ? reactFlowInstance.getNode(edge.source)
      : null

    const targetNode = edge?.target
      ? reactFlowInstance.getNode(edge.target)
      : null

    if (!targetNode || !sourceNode) return

    // 2. get the target node's id, which is the question id or 'end' if it's the end node
    const targetNodeId = targetNode.id

    // get the index of the source node
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
      targetQuestionId: targetNodeId,
      sourceLogic: sourceLogic ? sourceLogic : undefined,
    }).then(() => {
      void data.refreshFormData()
    })

    setSourceLogic(null)
    setAddQuestionDialogOpen(false)
  }

  const sourceNode = reactFlowInstance.getNode(
    reactFlowInstance.getEdge(id)?.source!,
  )

  const sourceNodeIdx = sourceNode?.data.label.split('.')[0] ?? 'start'

  const targetNode = reactFlowInstance.getNode(
    reactFlowInstance.getEdge(id)?.target!,
  )

  const targetNodeIdx = targetNode?.data.label.split('.')[0] ?? 'end'

  const getConditionLabel = (condition: TLogic['condition'] | undefined) => {
    switch (condition) {
      case 'always':
        return 'Always'
      default:
        return 'If...'
    }
  }

  const blockEdgeClick = () => {
    data?.setIsEdgeClickBlocked(true)
  }

  const unblockEdgeClick = () => {
    if (logicBuilderDialogOpen || addQuestionDialogOpen) return
    data?.setIsEdgeClickBlocked(false)
  }

  const onSetLogicBuilderDialogOpen = (isOpen: boolean) => {
    setLogicBuilderDialogOpen(isOpen)

    if (!isOpen) {
      data?.setIsEdgeClickBlocked(false)
    }
  }

  const onSetAddQuestionDialogOpen = (isOpen: boolean) => {
    setAddQuestionDialogOpen(isOpen)

    if (!isOpen) {
      data?.setIsEdgeClickBlocked(false)
    }
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
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
                zIndex: 9999,
              }}
              onMouseEnter={blockEdgeClick}
              onMouseLeave={unblockEdgeClick}
            >
              <Button
                variant={'secondary'}
                size={'icon'}
                className="nodrag nopan rounded-full [&>*]:hover:scale-100 hover:ring-4 ring-green-500 bg-secondary hover:bg-secondary p-1"
                onClick={onAddNode}
                onMouseEnter={blockEdgeClick}
                onMouseLeave={unblockEdgeClick}
              >
                <Plus size={28} />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
        <div
          style={{
            position: 'absolute',
            transform: `translate(${labelX - 25}px,${labelY + 35}px)`,
            pointerEvents: 'all',
            zIndex: 9999,
          }}
        >
          <foreignObject
            width={150}
            height={50}
            className={`overflow-visible pointer-events-none ${
              data?.showLogic ? '' : 'hidden'
            }`}
            style={{ zIndex: 9999, position: 'absolute' }}
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <div className="bg-primary shadow rounded-md pointer-events-none cursor-none text-secondary text-lg px-4 py-2 w-fit">
              <div className="space-x-2 text-base justify-center items-center">
                <span className="bg-violet-700 rounded-md text-center px-2 py-0.5 text-primary">
                  {sourceNodeIdx}
                </span>
                <span className="text-lg">→</span>
                <span className="bg-violet-700 rounded-md text-center px-2 py-0.5 text-primary">
                  {targetNodeIdx}
                </span>
                <span className="text-lg font-semibold">
                  {getConditionLabel(data?.logic.condition)}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-sm font-medium ">
                {data?.logic.value instanceof Array ? (
                  <div className="mt-2 space-y-2">
                    {data?.logic.value.map((option, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <span className="bg-violet-600 text-sm text-primary p-0.5 px-2 rounded-md">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="w-max">{option}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  data?.logic.value && <span>{data?.logic.value}</span>
                )}
              </div>
              {sourceNode?.id !== 'start' && (
                <div className="w-max">
                  <Button
                    variant={'ghost'}
                    className="pl-0 pb-0 text-primary-foreground font-semibold"
                  >
                    Click to edit logic
                  </Button>
                </div>
              )}
            </div>
          </foreignObject>
        </div>
      </EdgeLabelRenderer>

      <LogicBuilderDialog
        open={logicBuilderDialogOpen}
        setIsOpen={onSetLogicBuilderDialogOpen}
        sourceQuestion={sourceNode?.data.question as TQuestion & { id: string }}
        onAddLogic={onAddLogic}
      />

      <AddNewQuestionDialog
        isOpen={addQuestionDialogOpen}
        setIsOpen={onSetAddQuestionDialogOpen}
        addQuestion={onAddQuestion}
      />
    </>
  )
}
