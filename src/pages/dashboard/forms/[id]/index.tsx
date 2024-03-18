import DashboardLayout from "~/layouts/dashboardLayout";
import {
  Button,
  Icons,
  Input,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
} from "@components/ui";
import { useEffect, useState } from "react";
import { type TQuestion } from "~/types/question.types";
import { AddNewQuestion } from "~/components/form-builder/add-new-question";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { EditableQuestion } from "~/components/form-builder/editable-question";
import type { TFormSchema } from "~/types/form.types";
import { Preview } from "~/components/form-builder/preview";
import { FormStatus } from "@prisma/client";
import { Reorder } from "framer-motion";
import { toast } from "sonner";

type TProps = {
  formId: string;
};

export default function Form(props: TProps) {
  const router = useRouter();
  const {
    data: formData,
    isLoading: isLoadingFormData,
    // isSuccess: formDataFetched,
    isError: isFormInvalid,
    refetch: refreshFormData,
  } = api.form.getOne.useQuery(
    {
      id: props.formId,
    },
    {
      enabled: !!props.formId && props.formId !== "new",
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess(data) {
        setQuestions(data.questions as TQuestion[]);
      },
    }
  );

  const { mutateAsync: createForm, isLoading: isCreatingForm } =
    api.form.create.useMutation();
  const { mutateAsync: updateForm } = api.form.update.useMutation();
  const { mutateAsync: publishForm, isLoading: isPublishingForm } =
    api.form.publish.useMutation();
  const { mutateAsync: unpublishForm, isLoading: isUnpublishingForm } =
    api.form.unpublish.useMutation();

  const { mutateAsync: addQuestion, isLoading: isAddingQuestion } =
    api.form.addQuestion.useMutation();
  const { mutateAsync: editQuestion } = api.form.editQuestion.useMutation();
  const { mutateAsync: deleteQuestion } = api.form.deleteQuestion.useMutation();

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [isEditingFormName, setIsEditingFormName] = useState<boolean>(false);

  // check if formId is valid, if unvalid redirect to dashboard
  useEffect(() => {
    if (props.formId === "new") return;

    if (isFormInvalid) {
      // invalid form id
      console.log("here");
      void router.push("/dashboard/forms/new");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormInvalid]);

  const onAddQuestion = async (values: TQuestion) => {
    // if formId is new, create form first
    if (props.formId === "new") {
      await createForm({
        name: "New Form",
        questions: [values],
      }).then((res) => {
        void router.push(`/dashboard/forms/${res.id}`);
      });
      return;
    }

    // else add question to form
    void addQuestion({
      formId: props.formId,
      question: values,
    }).then(() => {
      void refreshFormData();
    });
  };

  const onEditQuestion = async (values: TQuestion) => {
    const question = questions[currentQuestion]!;
    await editQuestion({
      formId: props.formId,
      question: {
        ...values,
        id: question.id!,
      },
    }).then(() => {
      void refreshFormData();
    });
  };

  const onDeleteQuestion = async (questionId: string) => {
    await deleteQuestion({
      formId: props.formId,
      questionId: questionId,
    }).then(() => {
      void refreshFormData();
    });
  };

  const reorderQuestions = async (questions: TQuestion[]) => {
    setQuestions(questions);
    await updateForm({
      id: props.formId,
      questions: questions,
    }).then(() => {
      void refreshFormData();
    });
  };

  const updateFormName = async () => {
    setIsEditingFormName(false);

    const formName = document.getElementById("form-name") as HTMLInputElement;

    // if formId is new, create form
    if (props.formId === "new") {
      await createForm({
        name: formName.value,
        questions: [],
      }).then((res) => {
        void router.push(`/dashboard/forms/${res.id}`);
      });
      return;
    }

    // else update form name
    await updateForm({
      id: props.formId,
      name: formName.value,
    }).then(() => {
      void refreshFormData();
    });
  };

  const onTogglePublish = async () => {
    if (formData?.status === FormStatus.DRAFT) {
      await publishForm({
        id: props.formId,
      }).then(async () => {
        await refreshFormData();
        // copy form link to clipboard
        void navigator.clipboard.writeText(
          `${window.location.origin}/forms/${formData?.id}`
        );
      });
      toast.success("Form published and link copied to clipboard", {
        position: "top-center",
        duration: 1000,
      });
    } else {
      await unpublishForm({
        id: props.formId,
      }).then(() => {
        void refreshFormData();
      });
      toast.success("Form unpublished", {
        position: "top-center",
        duration: 1000,
      });
    }
  };

  return (
    <DashboardLayout title="dashboard">
      {props.formId !== "new" && isLoadingFormData ? (
        <div className="flex h-full items-center justify-center">
          <Icons.spinner className="mb-10 h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-center justify-between">
            {isEditingFormName ? (
              <form onSubmit={updateFormName}>
                <Input
                  id="form-name"
                  size={56}
                  placeholder="Search"
                  defaultValue={formData?.name ?? "New Form"}
                  onMouseEnter={() =>
                    document.getElementById("form-name")?.focus()
                  }
                  onMouseLeave={() => setIsEditingFormName(false)}
                />
              </form>
            ) : (
              <h1
                className="cursor-pointer text-3xl font-semibold"
                onClick={() => setIsEditingFormName(true)}
              >
                {formData?.name ?? "New Form"}
              </h1>
            )}

            <div className="flex items-center gap-4">
              {/* <Button type="button" onClick={() => void router.back()}>
                Back
              </Button> */}
              <Button
                type="button"
                onClick={() => void onTogglePublish()}
                variant={
                  formData?.status === FormStatus.PUBLISHED
                    ? "destructive"
                    : "default"
                }
                disabled={
                  isPublishingForm ||
                  isUnpublishingForm ||
                  !!!formData?.questions.length
                }
              >
                {isPublishingForm || isUnpublishingForm ? (
                  <Icons.spinner className="mr-3 h-5 w-5 animate-spin" />
                ) : formData?.status === FormStatus.PUBLISHED ? (
                  "Unpublish"
                ) : (
                  "Publish"
                )}
              </Button>
            </div>
          </div>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={40} maxSize={60} className="h-full">
              <ScrollArea className="h-full pr-8">
                <div className="flex h-full flex-col gap-6">
                  <Reorder.Group
                    onReorder={reorderQuestions}
                    values={questions}
                    className="flex flex-col gap-4"
                  >
                    {questions.map((question, index: number) => {
                      return (
                        <Reorder.Item
                          key={question.id}
                          value={question}
                          className="flex items-center justify-between gap-4"
                        >
                          <EditableQuestion
                            key={index}
                            editQuestion={onEditQuestion}
                            deleteQuestion={onDeleteQuestion}
                            {...question}
                            index={index}
                            setCurrentQuestion={setCurrentQuestion}
                          />
                        </Reorder.Item>
                      );
                    })}
                  </Reorder.Group>
                  {isAddingQuestion || isCreatingForm ? (
                    <div className="flex items-center justify-center p-1">
                      <Icons.spinner className="mr-3 h-5 w-5 animate-spin" />
                    </div>
                  ) : null}
                  <AddNewQuestion onAddQuestion={onAddQuestion} />
                </div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <div className="flex flex-col gap-4 p-4">
                <Preview
                  formSchema={formData?.formSchema as TFormSchema}
                  currentQuestionIdx={currentQuestion}
                  questions={formData?.questions as TQuestion[]}
                />
                <p className="text-center text-muted-foreground">Preview</p>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session?.user?.id) {
    return {
      props: {
        formId: ctx.query.id,
      },
    };
  }

  return {
    redirect: {
      destination: "/auth/signin",
      permanent: false,
    },
    props: {},
  };
};
