import { memo } from 'react'
import { Handle, Position } from 'reactflow'

const EndNode: () => JSX.Element = () => {
  return (
    <div className="flex border border-violet-800 rounded-lg bg-primary-foreground p-6">
      End
      <Handle type="target" position={Position.Left} />
    </div>
  )
}

export default memo(EndNode)
