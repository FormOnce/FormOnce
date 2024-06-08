import { Button, Icons, Input } from '@components/ui'
import { FormStatus } from '@prisma/client'
import { Check, Edit, Split, X } from 'lucide-react'
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BasicBuilder } from '~/components/form-builder/basic-builder'
import { FlowBuilder } from '~/components/form-builder/flow-builder'
import { ShareDialog } from '~/components/form-builder/share-dialog'
import DashboardLayout from '~/layouts/dashboardLayout'
import { getServerAuthSession } from '~/server/auth'
import { type TQuestion } from '~/types/question.types'
import { api } from '~/utils/api'

type TProps = {
  formId: string
}

export default function Form(props: TProps) {
  const router = useRouter()
  const {
    data: data,
    isLoading: isLoadingFormData,
    // isSuccess: formDataFetched,
    isError: isFormInvalid,
    refetch: refreshFormData,
  } = api.form.getOne.useQuery(
    {
      id: props.formId,
    },
    {
      enabled: !!props.formId && props.formId !== 'new',
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess(data) {
        setQuestions(data.form?.questions as TQuestion[])
      },
    },
  )

  const { mutateAsync: createForm, isLoading: isCreatingForm } =
    api.form.create.useMutation()
  const { mutateAsync: updateForm, isLoading: isUpdatingForm } =
    api.form.update.useMutation()
  const { mutateAsync: publishForm, isLoading: isPublishingForm } =
    api.form.publish.useMutation()
  const { mutateAsync: unpublishForm, isLoading: isUnpublishingForm } =
    api.form.unpublish.useMutation()

  const { mutateAsync: addQuestion, isLoading: isAddingQuestion } =
    api.form.addQuestion.useMutation()
  const { mutateAsync: editQuestion } = api.form.editQuestion.useMutation()
  const { mutateAsync: deleteQuestion } = api.form.deleteQuestion.useMutation()

  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [questions, setQuestions] = useState<TQuestion[]>([])
  const [isEditingFormName, setIsEditingFormName] = useState<boolean>(false)

  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false)

  const [view, setView] = useState<'basic' | 'flow'>('basic')

  const formData = data?.form

  // check if formId is valid, if unvalid redirect to dashboard
  useEffect(() => {
    if (props.formId === 'new') return

    if (isFormInvalid) {
      // invalid form id
      console.log('here')
      void router.push('/dashboard/forms/new')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormInvalid])

  const onAddQuestion = async (values: TQuestion) => {
    // if formId is new, create form first
    if (props.formId === 'new') {
      await createForm({
        name: 'New Form',
        questions: [values],
      }).then((res) => {
        void router.push(`/dashboard/forms/${res.id}`)
      })
      return
    }

    // else add question to form
    void addQuestion({
      formId: props.formId,
      question: values,
    }).then(() => {
      void refreshFormData()
    })
  }

  const onEditQuestion = async (values: TQuestion) => {
    const question = questions[currentQuestion]!
    await editQuestion({
      formId: props.formId,
      question: {
        ...values,
        id: question.id!,
      },
    }).then(() => {
      void refreshFormData()
    })
  }

  const onDeleteQuestion = async (questionId: string) => {
    await deleteQuestion({
      formId: props.formId,
      questionId: questionId,
    }).then(() => {
      void refreshFormData()
    })
  }

  const reorderQuestions = async (questions: TQuestion[]) => {
    setQuestions(questions)
    await updateForm({
      id: props.formId,
      questions: questions,
    }).then(() => {
      void refreshFormData()
    })
  }

  const updateFormName = async (e: React.FormEvent) => {
    e.preventDefault()

    const formName = document.getElementById('form-name') as HTMLInputElement

    if (formName.value === formData?.name!) return setIsEditingFormName(false)

    if (formName.value === '')
      return toast.error('Form name cannot be empty', {
        position: 'top-center',
        duration: 1500,
      })

    // if formId is new, create form
    if (props.formId === 'new') {
      await createForm({
        name: formName.value,
        questions: [],
      }).then((res) => {
        void router.push(`/dashboard/forms/${res.id}`)
      })
      return
    }

    // else update form name
    await updateForm({
      id: props.formId,
      name: formName.value,
    }).then(() => {
      void refreshFormData()
    })
    setIsEditingFormName(false)
  }

  const onTogglePublish = async () => {
    if (formData?.status === FormStatus.DRAFT) {
      await publishForm({
        id: props.formId,
      }).then(async () => {
        await refreshFormData()
      })
      setShareDialogOpen(true)
      toast.success('Form published', {
        position: 'top-center',
        duration: 1500,
      })
    } else {
      await unpublishForm({
        id: props.formId,
      }).then(() => {
        void refreshFormData()
      })
      toast.success('Form unpublished', {
        position: 'top-center',
        duration: 1500,
      })
    }
  }

  const onToggleView = () => {
    setView(view === 'basic' ? 'flow' : 'basic')
  }

  return (
    <DashboardLayout title="dashboard">
      {props.formId !== 'new' && isLoadingFormData ? (
        <div className="flex h-full items-center justify-center">
          <Icons.spinner className="mb-10 h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-center justify-between">
            {isEditingFormName ? (
              isUpdatingForm ? (
                <div className="flex items-center gap-1">
                  <Icons.spinner className="mr-3 h-5 w-5 animate-spin" />
                </div>
              ) : (
                <form
                  onSubmit={updateFormName}
                  className="flex gap-2 items-center"
                >
                  <Input
                    id="form-name"
                    size={56}
                    placeholder="Search"
                    defaultValue={formData?.name ?? 'New Form'}
                    onMouseEnter={() =>
                      document.getElementById('form-name')?.focus()
                    }
                  />
                  <div className="flex gap-0">
                    <Button size={'sm'} variant={'ghost'} type="submit">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size={'sm'}
                      variant={'ghost'}
                      type="button"
                      onClick={() => setIsEditingFormName(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )
            ) : (
              <div className="flex gap-1">
                <h1 className="cursor-pointer text-2xl font-semibold">
                  {formData?.name ?? 'New Form'}
                </h1>
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  onClick={() => setIsEditingFormName(true)}
                >
                  <Edit className="text-muted-foreground h-4 w-4" />
                </Button>
              </div>
            )}

            <Button
              size={'sm'}
              onClick={onToggleView}
              className="absolute top-0 right-0 -translate-x-8 gap-1 rounded-t-none h-6 px-3 py-1.5"
            >
              {view === 'basic' && <Split className="h-4 w-4" />}
              Swith to {view === 'basic' ? 'Flow' : 'Basic'} builder
            </Button>

            <div className="flex items-center gap-2 mt-2">
              <Button
                size={'sm'}
                type="button"
                onClick={() => void onTogglePublish()}
                variant={
                  formData?.status === FormStatus.PUBLISHED
                    ? 'destructive'
                    : 'default'
                }
                disabled={!formData?.questions.length}
                loading={isPublishingForm || isUnpublishingForm}
              >
                {formData?.status === FormStatus.PUBLISHED
                  ? 'Unpublish'
                  : 'Publish'}
              </Button>
              <ShareDialog
                disabled={formData?.status !== FormStatus.PUBLISHED}
                open={shareDialogOpen}
                onOpenChange={setShareDialogOpen}
                link={formData?.link ?? ''}
              />
              <Button
                onClick={() =>
                  void router.push(`/dashboard/forms/${props.formId}/summary`)
                }
                variant={'secondary'}
                size={'sm'}
              >
                Responses
              </Button>
            </div>
          </div>
          {view === 'flow' ? (
            <FlowBuilder questions={questions} formData={formData} />
          ) : (
            <BasicBuilder
              questions={questions}
              formData={formData}
              isAddingQuestion={isAddingQuestion}
              isCreatingForm={isCreatingForm}
              isUnpublishingForm={isUnpublishingForm}
              currentQuestion={currentQuestion}
              onAddQuestion={onAddQuestion}
              onEditQuestion={onEditQuestion}
              onDeleteQuestion={onDeleteQuestion}
              reorderQuestions={reorderQuestions}
              setCurrentQuestion={setCurrentQuestion}
              onTogglePublish={onTogglePublish}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx)

  if (session?.user?.id) {
    return {
      props: {
        formId: ctx.query.id,
      },
    }
  }

  return {
    redirect: {
      destination: '/auth/signin',
      permanent: false,
    },
    props: {},
  }
}
