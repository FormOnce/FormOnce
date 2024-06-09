import { Play, PlayCircle } from 'lucide-react'
import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Button } from '~/components/ui'
import { TQuestion } from '~/types/question.types'
import { handleStyleLeft, handleStyleRight } from './utils'

type QuestionNodeProps = {
  data: {
    question: TQuestion
    label: string
  }
}

const QuestionNode = ({ data }: QuestionNodeProps) => {
  const { question, label } = data
  return (
    <div className="flex flex-col border-2 border-violet-800 hover:border-violet-500 [&>div:first-child]:hover:border-violet-500 rounded-lg bg-primary-foreground w-64 h-56 hover:scale-105 transition-all duration-200">
      <div className="px-4 py-2 bg-primary-foreground rounded-t-lg border-b-2  border-violet-800">
        {label}
      </div>
      <div className="flex h-full rounded-b-lg">
        <div className="w-1/2 h-full rounded-bl-lg bg-black opacity-50 hover:opacity-100 flex justify-center items-center border-r border-violet-500 [&>*:first-child]:hover:bg-violet-800 [&>*:first-child]:hover:text-white [&>*:first-child]:hover:h-10 [&>*:first-child]:hover:w-10">
          <Button
            variant={'secondary'}
            size={'icon'}
            className="rounded-full p-2 hover:w-10 hover:h-10 hover:bg-violet-800 hover:text-white"
          >
            <Play size={32} className="text-violet-300 ml-0.5" />
          </Button>
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center items-center gap-4 [&>button]:hover:bg-violet-600">
          <Button variant={'secondary'} size={'sm'} className="w-[70%] h-5" />
          <Button variant={'secondary'} size={'sm'} className="w-[70%] h-5" />
          {/* <Button variant={'secondary'} size={'sm'} className="w-[75%] h-6" /> */}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyleRight}
      />
      <Handle type="target" position={Position.Left} style={handleStyleLeft} />
    </div>
  )
}

export default memo(QuestionNode)
