import { Plus } from 'lucide-react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  getBezierPath,
  getConnectedEdges,
  useReactFlow,
} from 'reactflow'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui'

type CustomEdgeProps = {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
}

export default function CustomeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: CustomEdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  })

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
    console.log('add node at edge: ', id)
    onEdgeClick()
  }

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
    </>
  )
}
