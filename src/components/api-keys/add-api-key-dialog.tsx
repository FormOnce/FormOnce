import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from '@components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { CopyIcon, KeyRoundIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type TAddApiKeyForm, ZAddApiKeyForm } from '~/types/api-keys.types'
import { api } from '~/utils/api'

type TAddApiKeyDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

export function AddApiKeyDialog({ disabled, ...props }: TAddApiKeyDialogProps) {
  const { mutateAsync: createApiKey, isLoading } =
    api.apiKey.create.useMutation()

  const [open, setOpen] = useState(props.open ?? false)
  const [key, setKey] = useState<string>('')

  const formSchema = ZAddApiKeyForm

  const form = useForm<TAddApiKeyForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onSubmit',
  })

  const onSubmit = async (values: TAddApiKeyForm) => {
    try {
      const generatedKey = await createApiKey(values)
      toast.success('Api Key created successfully', {
        duration: 3000,
        position: 'top-center',
      })

      if (generatedKey) {
        setKey(generatedKey.key)
      }
    } catch (error) {
      toast.error('Failed to create Api Key', {
        duration: 3000,
        position: 'top-center',
      })
    }
  }

  const onError = (error: unknown) => {
    console.error(error)
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open)
    props.onOpenChange?.(open)
    if (!open) {
      form.reset()
      setKey('')
    }
  }

  const handleCopy = () => {
    void navigator.clipboard.writeText(key)
    toast.success('Link copied to clipboard', {
      position: 'top-center',
      duration: 1500,
    })
  }

  return key ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-max">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to fill this
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="key" className="sr-only">
              Secret key
            </Label>
            <Input id="key" defaultValue={key} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={'lg'} disabled={disabled}>
          <KeyRoundIcon className="mr-2 h-5 w-5" />
          Create new key
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-max">
        <DialogHeader className="my-2">
          <DialogTitle className="flex items-center gap-3">
            <KeyRoundIcon className="h-6 w-6" /> <span>Create new key</span>
          </DialogTitle>
          <DialogDescription>
            Use this key to submit form data via external methods
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8"
            name="add-ApiKey-form"
            id="add-ApiKey-form"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="off"
                      placeholder="My new key"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique name for your key to help you identify it
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="my-4 mt-6 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" form="add-ApiKey-form" loading={isLoading}>
            {isLoading ? 'Creating...' : 'Create key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
