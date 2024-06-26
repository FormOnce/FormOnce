import { Form } from '@prisma/client'
import { useCallback } from 'react'
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { TQuestion } from '~/types/question.types'
import QuestionNode from './QuestionNode'
import EndNode from './end-node'
import StartNode from './start-node'

const DEFAULT_EDGE_LENGTH = 500

const proOptions = {
  hideAttribution: true,
}

type FlowBuilderProps = {
  questions: TQuestion[]
  formData: Form | undefined
}

const nodeTypes = {
  question: QuestionNode,
  start: StartNode,
  endNode: EndNode,
}

export const FlowBuilder = ({ questions, formData }: FlowBuilderProps) => {
  const initialNodes: Node[] = questions.map((question, i) => ({
    id: question.id!,
    data: { label: `${i + 1}. ${question.title}`, question },
    position: { x: (i + 1) * DEFAULT_EDGE_LENGTH, y: 100 },
    type: 'question',
  }))

  initialNodes.unshift({
    id: 'start',
    type: 'start',
    data: { label: 'Start' },
    position: { x: 0, y: 100 },
  })

  initialNodes.push({
    id: 'end',
    data: { label: 'End' },
    type: 'endNode',
    position: { x: (questions.length + 1) * DEFAULT_EDGE_LENGTH, y: 100 },
  })

  const initialEdges: Edge[] = questions.map((question, i) => ({
    id: question.id!,
    source: question.id!,
    target: questions[i + 1]?.id! || 'end',
    // animated: true,
  }))

  initialEdges.unshift({
    id: 'start',
    source: 'start',
    target: questions[0]?.id!,
  })

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  )

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        proOptions={proOptions}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  )
}
