import { MoveRight } from 'lucide-react'
import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { handleStyleRight } from './utils'

const StartNode: () => JSX.Element = () => {
  return (
    <div className="flex flex-col border-2 hover:border-violet-500 border-violet-800 rounded-lg bg-primary-foreground p-4 w-56 h-56 justify-center items-center hover:scale-105 transition-all duration-200">
      <p className="top-10 text-center text-2xl">Start</p>
      <MoveRight size={64} />
      <Handle
        className="w-10"
        type="source"
        position={Position.Right}
        style={handleStyleRight}
      />
    </div>
  )
}

export default memo(StartNode)
