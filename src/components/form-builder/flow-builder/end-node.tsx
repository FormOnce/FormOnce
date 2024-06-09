import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { handleStyleLeft } from './utils'

const EndNode: () => JSX.Element = () => {
  return (
    <div className="flex flex-col border-2 hover:border-violet-500 border-violet-800 rounded-lg bg-primary-foreground p-4 w-56 h-56 justify-center items-center hover:scale-105 transition-all duration-200">
      <p className="text-2xl">End</p>
      <Handle type="target" position={Position.Left} style={handleStyleLeft} />
    </div>
  )
}

export default memo(EndNode)
