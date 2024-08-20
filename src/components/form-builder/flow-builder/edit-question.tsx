import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui'
import { Copy, Trash, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Edge, Node, useReactFlow } from 'reactflow'
import { ELogicCondition, TLogic } from '~/types/question.types'

const getConditionsfromLogic = (logics: TLogic[]) => {
  const conditions: TConditions = {}

  if (logics.length === 0) {
    return conditions
  }

  let optionCount = 0

  logics.forEach((logic) => {
    if (logic.value instanceof Array) {
      logic.value.forEach((option) => {
        conditions[String.fromCharCode(65 + optionCount++)] = {
          option,
          skipTo: logic.skipTo,
          condition: logic.condition,
        }
      })
    } else {
      conditions[logic.value] = {
        option: logic.value,
        skipTo: logic.skipTo,
        condition: logic.condition,
      }
    }
  })

  return conditions
}

export type EditQuestionProps = {
  isOpen: boolean
  onEdit: () => void
  onClose: () => void
  editingNode: Node | null
  editingEdge: Edge | null
}

type TConditions = {
  [key: string]: {
    option: string
    skipTo: string
    condition: TLogic['condition']
  }
}

export const EditQuestion = ({
  isOpen,
  onClose,
  editingNode,
  editingEdge,
}: EditQuestionProps) => {
  const reactFlowInstance = useReactFlow()

  //   Condtions are logic conditions that are used to determine the next step in the flow depending on the answer to a question.
  const [conditions, setConditions] = useState<TConditions | null>(null)

  useEffect(() => {
    if (!editingNode) return
    const logics = editingNode.data.question.logic ?? []
    const updateConditions = getConditionsfromLogic(logics)
    setConditions(updateConditions)
  }, [editingEdge, editingNode])

  if (!editingNode || !editingEdge) {
    return null
  }

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose()
      setConditions({})
    }
  }

  const getConditionLabel = (condition: TLogic['condition'] | undefined) => {
    switch (condition) {
      case 'always':
        return 'Always'
      default:
        return 'If'
    }
  }

  const getNodeLabelFromId = (id: string) => {
    const node = reactFlowInstance.getNode(id)
    if (!node) return ['', '']

    const labelA = node.data.label.split('.')[0]

    if (labelA === 'End') return ['End' + ' 👋', '']
    return [labelA, node.data.label.split('.')[1]]
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="sm:max-w-[500px] sm:w-[450px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between w-full gap-2">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {editingNode?.data.label}
              </div>
              <div className="flex gap-0">
                <Button variant={'ghost'} size={'sm'}>
                  <Copy className="h-4 w-4 hover:scale-105" />
                </Button>

                <Button
                  variant={'ghost'}
                  size={'sm'}
                  className="hover:bg-destructive hover:text-destructive-foreground shadow-sm"
                >
                  <Trash className="h-4 w-4 hover:scale-105" />
                </Button>
                <SheetClose>
                  <Button variant={'ghost'} size={'sm'}>
                    <X className="h-6 w-5 hover:scale-105" />
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="h-full">
          <Tabs defaultValue="logic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="answer">Answer</TabsTrigger>
              <TabsTrigger value="logic">Logic</TabsTrigger>
            </TabsList>
            <TabsContent value="video" className="flex flex-col gap-4">
              <Input
                type="url"
                width={'full'}
                label="Add your video URL here"
              />
            </TabsContent>
            <TabsContent value="answer" className="flex flex-col gap-4">
              How would you like to ask this question?
            </TabsContent>
            <TabsContent value="logic" className="flex flex-col gap-3">
              {conditions &&
                Object.entries(conditions).map(([key, condition]) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        key={key}
                        className="flex justify-between items-center border py-2 px-4 rounded-md cursor-pointer hover:bg-primary-foreground hover:border-violet-600"
                      >
                        <div className="flex gap-4 items-center text-sm">
                          <span>{getConditionLabel(condition.condition)}</span>
                          {condition.condition !== ELogicCondition.ALWAYS && (
                            <div className="border py-1.5 px-2 rounded-md overflow-hidden text-ellipsis whitespace-nowrap">
                              <span className="bg-violet-600 text-primary p-0.5 px-2 rounded-sm">
                                {key}
                              </span>
                              <span className="ml-2 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                {condition.option}
                              </span>
                            </div>
                          )}
                          <span>skip to →</span>
                        </div>
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap bg-violet-600 text-sm p-0.5 px-2 rounded-full">
                          {getNodeLabelFromId(condition.skipTo)[0]}
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-2">
                      <p className="text-xs text-secondary-foreground opacity-75">
                        Choose a destination...
                      </p>
                      <div>
                        {/* all nodes but the current one and start node*/}
                        {reactFlowInstance.getNodes().map((node) => {
                          if (node.id === editingNode.id || node.id === 'start')
                            return null

                          const [id, label] = getNodeLabelFromId(node.id)
                          return (
                            <div
                              key={node.id}
                              className={`flex items-center gap-2 border border-black py-2 px-4 rounded-md cursor-pointer text-sm hover:bg-primary-foreground hover:border-violet-600 ${
                                node.id === condition.skipTo &&
                                '!border-violet-600 text-primary'
                              }`}
                              onClick={() => {
                                const updatedConditions = {
                                  ...conditions,
                                  [key]: {
                                    ...condition,
                                    skipTo: node.id,
                                  },
                                }
                                setConditions(updatedConditions)
                              }}
                            >
                              <span className="bg-violet-600 text-primary p-0.5 px-2 rounded-sm">
                                {id}
                              </span>
                              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
            </TabsContent>
          </Tabs>
        </div>
        <SheetFooter>
          <Button size={'lg'} className="w-full text-base">
            Done 👍
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
