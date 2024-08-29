import { Form } from '@prisma/client'
import { useCallback, useState } from 'react'
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MiniMap,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { TLogic, TQuestion } from '~/types/question.types'
import { api } from '~/utils/api'
import QuestionNode from './QuestionNode'
import CustomEdge from './custom-edge'
import { EditQuestion } from './edit-question'
import EndNode from './end-node'
import StartNode from './start-node'

const DEFAULT_EDGE_LENGTH = 600

const proOptions = {
  hideAttribution: true,
}

type FlowBuilderProps = {
  formId: Form['id']
}

const nodeTypes = {
  question: QuestionNode,
  start: StartNode,
  endNode: EndNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

export const FlowBuilder = ({ formId }: FlowBuilderProps) => {
  const {
    data: data,
    refetch: refreshFormData,
    isFetching,
  } = api.form.getOne.useQuery(
    {
      id: formId,
    },
    {
      enabled: !!formId && formId !== 'new',
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess(data) {
        if (!data.form) return

        const questions = data.form.questions as TQuestion[]
        const updatedNodes: Node[] = questions.map((question, i) => ({
          id: question.id!,
          data: {
            label: `${i + 1}. ${question.title}`,
            question,
            formId: data.form?.id,
            refreshFormData,
          },
          position: question.position || {
            x: (i + 1) * DEFAULT_EDGE_LENGTH,
            y: 100,
          },
          type: 'question',
        }))

        const startNode = nodes[0]
        const endNode = nodes[nodes.length - 1]

        if (!startNode || !endNode) return
        updatedNodes.unshift(startNode)

        const lastQ = questions[questions.length - 1]
        updatedNodes.push({
          id: 'end',
          data: { label: 'End' },
          type: 'endNode',
          position: lastQ?.position
            ? {
                x: lastQ?.position.x + DEFAULT_EDGE_LENGTH,
                y: lastQ?.position.y,
              }
            : { x: (questions.length + 1) * DEFAULT_EDGE_LENGTH, y: 100 },
        })

        const updatedEdges: Edge[] = questions.flatMap((question) => {
          return question.logic!.map((logic) => ({
            id: `${question.id}-${logic.skipTo}`,
            source: question.id!,
            target: logic.skipTo,
            data: {
              formId: formId,
              refreshFormData,
              logic: logic,
              showLogic: false,
              setIsEdgeClickBlocked,
            },
            type: 'custom',
            style: { stroke: 'white', strokeWidth: 2 },
          }))
        })

        updatedEdges.unshift({
          id: 'start',
          source: 'start',
          target: questions[0]?.id! ?? 'end',
          data: {
            formId: formId,
            refreshFormData,
            logic: {
              questionId: 'start',
              condition: 'always',
              value: '',
              skipTo: questions[0]?.id!,
            },
            showLogic: false,
          },
          type: 'custom',
          style: { stroke: 'white', strokeWidth: 2 },
        })

        setEdges(updatedEdges)
        setNodes(updatedNodes)
      },
    },
  )

  const reactFlowInstance = useReactFlow()

  const [editQuestionOpen, setEditQuestionOpen] = useState(false)
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null)

  const [isEdgeClickBlocked, setIsEdgeClickBlocked] = useState(false)

  const formData = data?.form
  const questions = (formData?.questions ?? []) as TQuestion[]

  const { mutateAsync: editQuestion } = api.form.editQuestion.useMutation()

  const initialNodes: Node[] = []

  const firstQ = questions[0]
  initialNodes.unshift({
    id: 'start',
    type: 'start',
    data: { label: 'Start' },
    position: firstQ?.position
      ? {
          x: firstQ?.position.x - DEFAULT_EDGE_LENGTH,
          y: firstQ?.position.y,
        }
      : { x: 0, y: 100 },
  })

  const lastQ = questions[questions.length - 1]
  initialNodes.push({
    id: 'end',
    data: { label: 'End' },
    type: 'endNode',
    position: lastQ?.position
      ? {
          x: lastQ?.position.x + DEFAULT_EDGE_LENGTH,
          y: lastQ?.position.y,
        }
      : { x: (questions.length + 1) * DEFAULT_EDGE_LENGTH, y: 100 },
  })

  const initialEdges: Edge[] = []

  initialEdges.unshift({
    id: 'start',
    source: 'start',
    target: questions[0]?.id! ?? 'end',
    data: {
      formId: formId,
      refreshFormData,
      logic: [],
      showLogic: false,
    },
    type: 'custom',
  })

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  )

  const onNodeDragStop = useCallback(
    async (
      _: unknown,
      node: { data: { question: TQuestion }; position: TQuestion['position'] },
    ) => {
      const question = node.data.question

      if (!question) return

      if (
        question.position &&
        question.position.x === node.position?.x &&
        question.position.y === node.position?.y
      ) {
        return
      }

      const updatedQuestion = {
        ...question,
        id: question.id!,
        position: node.position,
      }

      await editQuestion({ formId: formData?.id!, question: updatedQuestion })
    },
    [nodes],
  )

  const onEdgeMouseEnter = (e: React.MouseEvent, edge: Edge) => {
    setEdges((edges: Edge[]) =>
      edges.map((ed: Edge) =>
        ed.id === edge.id
          ? {
              ...ed,
              animated: true,
              style: {
                stroke: 'white',
                strokeWidth: 4,
              },
              data: {
                ...ed.data,
                showLogic: true,
              },
            }
          : ed,
      ),
    )
  }

  const onEdgeMouseLeave = (e: React.MouseEvent, edge: Edge) => {
    setEdges((edges: Edge[]) =>
      edges.map((ed: Edge) =>
        ed.id === edge.id
          ? {
              ...ed,
              animated: false,
              style: {
                stroke: 'white',
                strokeWidth: 2,
              },
              data: {
                ...ed.data,
                showLogic: false,
              },
            }
          : ed,
      ),
    )
  }

  const onEdgeClick = (e: React.MouseEvent, edge: Edge) => {
    if (isEdgeClickBlocked) return

    const sourceNode = edge?.source
      ? reactFlowInstance.getNode(edge.source)
      : null

    if (!sourceNode || sourceNode.id === 'start') return

    reactFlowInstance.fitView({
      nodes: [sourceNode],
      padding: 150,
      duration: 500,
      minZoom: 1,
    })

    setEditQuestionOpen(true)
    setEditingNode(sourceNode)
    setEditingEdge(edge)
  }

  const onEditQuestion = () => {
    // edit question
    setEditQuestionOpen(false)
  }

  const onClose = () => {
    setEditQuestionOpen(false)
    reactFlowInstance.fitView({
      nodes: [editingNode!],
      padding: 100,
      duration: 500,
      minZoom: 0.6,
    })
  }

  const onUpdateLogic = async (values: TLogic[]) => {
    const updatedQuestion = {
      ...editingNode!.data.question,
      logic: values,
    }

    await editQuestion({
      formId: formData?.id!,
      question: updatedQuestion,
    }).then(() => {
      refreshFormData()
    })
  }

  if (isFetching) return <div>Loading...</div>

  return (
    <div className="h-[100%]">
      <ReactFlow
        proOptions={proOptions}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onEdgeClick={onEdgeClick}
        fitView
        // wait for 100ms and then zoom to fit first 2 questions
        onInit={(reactFlowInstance) => {
          setTimeout(() => {
            const startNode = reactFlowInstance.getNode('start')
            const firstQ = reactFlowInstance.getNode(questions[0]?.id!)
            const secondQ = reactFlowInstance.getNode(questions[1]?.id!)

            if (firstQ && secondQ && startNode) {
              reactFlowInstance.fitView({
                nodes: [startNode, firstQ, secondQ],
                padding: 100,
                duration: 500,
                minZoom: 0.7,
              })
            } else {
              reactFlowInstance.fitView({
                padding: 100,
                duration: 500,
                minZoom: 0.7,
              })
            }
          }, 250)
        }}
      >
        <Background />
        <Controls position="bottom-left" />
        <MiniMap zoomable pannable position="bottom-right" />
      </ReactFlow>
      <EditQuestion
        isOpen={editQuestionOpen}
        onEdit={onEditQuestion}
        onClose={onClose}
        editingNode={editingNode}
        editingEdge={editingEdge}
        onUpdateLogic={onUpdateLogic}
      />
    </div>
  )
}
