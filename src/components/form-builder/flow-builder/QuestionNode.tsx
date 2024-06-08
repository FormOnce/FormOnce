import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { TQuestion } from '~/types/question.types'

type QuestionNodeProps = {
  data: {
    question: TQuestion
    label: string
  }
}

const QuestionNode = ({ data }: QuestionNodeProps) => {
  const { question, label } = data
  return (
    <div className="flex flex-col border border-violet-800 rounded-lg bg-primary-foreground w-[200px]">
      <div className="px-4 py-1.5 border-b border-violet-800 text-xs">
        {question.title}
      </div>
      <div className="p-4 text-xs">{question.description}</div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  )
}

export default memo(QuestionNode)
