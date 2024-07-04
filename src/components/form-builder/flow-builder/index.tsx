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
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { TQuestion } from '~/types/question.types'
import { api } from '~/utils/api'
import QuestionNode from './QuestionNode'
import CustomEdge from './custom-edge'
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
    isError: isFormInvalid,
    refetch: refreshFormData,
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

        const updatedEdges: Edge[] = questions.map((question, i) => ({
          id: question.id!,
          source: question.id!,
          target: questions[i + 1]?.id! || 'end',
          data: {
            formId: formId,
            refreshFormData,
          },
          type: 'custom',
        }))

        updatedEdges.unshift({
          id: 'start',
          source: 'start',
          target: questions[0]?.id! ?? 'end',
          data: {
            formId: formId,
            refreshFormData,
          },
          type: 'custom',
        })

        setEdges(updatedEdges)
        setNodes(updatedNodes)
      },
    },
  )

  const formData = data?.form
  const questions = (formData?.questions ?? []) as TQuestion[]

  const { mutateAsync: editQuestion } = api.form.editQuestion.useMutation()

  const initialNodes: Node[] = questions?.map((question, i) => ({
    id: question.id!,
    data: {
      label: `${i + 1}. ${question.title}`,
      question,
      formId: formData?.id,
      refreshFormData,
    },
    position: question.position || { x: (i + 1) * DEFAULT_EDGE_LENGTH, y: 100 },
    type: 'question',
  }))

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

  const initialEdges: Edge[] = questions.map((question, i) => ({
    id: question.id!,
    source: question.id!,
    target: questions[i + 1]?.id! || 'end',
    data: {
      formId: formId,
      refreshFormData,
    },
    type: 'custom',
  }))

  initialEdges.unshift({
    id: 'start',
    source: 'start',
    target: questions[0]?.id! ?? 'end',
    data: {
      formId: formId,
      refreshFormData,
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
    </div>
  )
}
