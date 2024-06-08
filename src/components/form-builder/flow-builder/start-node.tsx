import { ArrowRight } from 'lucide-react'
import { memo } from 'react'
import { Handle, Position } from 'reactflow'

const StartNode: () => JSX.Element = () => {
  return (
    <div className="flex border border-violet-800 rounded-lg bg-primary-foreground p-6">
      <ArrowRight size={24} />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default memo(StartNode)
