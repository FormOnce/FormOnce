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
import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
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
import { FormSubmitHandler } from "react-hook-form";

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
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const { mutateAsync: createForm, isLoading: isCreatingForm } =
    api.form.create.useMutation();
  const { mutateAsync: addQuestion, isLoading: isAddingQuestion } =
    api.form.addQuestion.useMutation();
  const { mutateAsync: updateForm, isLoading: isUpdatingForm } =
    api.form.update.useMutation();

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [isEditingFormName, setIsEditingFormName] = useState<boolean>(false);

  // check if formId is valid, if unvalid redirect to dashboard
  useEffect(() => {
    if (props.formId === "new") return;

    if (isFormInvalid) {
      // invalid form id
      console.log("here");
      void router.push("/forms/new");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormInvalid]);

  const onAddQuestion = (values: TQuestion) => {
    // if formId is new, create form first
    if (props.formId === "new") {
      void createForm({
        name: "New Form",
        questions: [values],
      }).then((res) => {
        void router.push(`/forms/${res.id}`);
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

  // TODO: implement edit question
  const onEditQuestion = (values: TQuestion) => {
    console.log(values);
  };

  const updateFormName = async () => {
    setIsEditingFormName(false);
    const formName = document.getElementById("form-name") as HTMLInputElement;
    await updateForm({
      id: props.formId,
      name: formName.value,
    }).then(() => {
      void refreshFormData();
    });
  };

  return (
    <DashboardLayout title="dashboard">
      {isLoadingFormData ? (
        <div className="flex h-full items-center justify-center">
          <Icons.spinner className="mb-10 h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-center justify-between">
            {isEditingFormName ? (
              <form
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={updateFormName}
              >
                <Input
                  id="form-name"
                  size={56}
                  placeholder="Search"
                  defaultValue={formData!.name}
                  onMouseEnter={() =>
                    document.getElementById("form-name")?.focus()
                  }
                  onMouseLeave={() => setIsEditingFormName(false)}
                />
              </form>
            ) : isUpdatingForm ? (
              <Icons.spinner className="mr-3 h-5 w-5 animate-spin" />
            ) : (
              <h1
                className="cursor-pointer text-3xl font-semibold"
                onClick={() => setIsEditingFormName(true)}
              >
                {formData!.name}
              </h1>
            )}

            <div className="flex items-center gap-4">
              <Button type="button" onClick={() => void router.push("/forms")}>
                Back
              </Button>
              <Button type="button">
                {formData?.status === FormStatus.DRAFT
                  ? "Publish"
                  : "Unpublish"}
              </Button>
            </div>
          </div>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={40} maxSize={60} className="h-full">
              <ScrollArea className="h-full pr-8">
                <div className="flex h-full flex-col gap-6">
                  {formData?.questions.map((unTypedQ, index: number) => {
                    const question = unTypedQ as TQuestion;
                    switch (question.type) {
                      case "text":
                        return (
                          <EditableQuestion
                            key={index}
                            editQuestion={onEditQuestion}
                            {...question}
                            index={index}
                            setCurrentQuestion={setCurrentQuestion}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
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
                {formData?.formSchema && (
                  <Preview
                    formSchema={formData?.formSchema as TFormSchema}
                    currentQuestionIdx={currentQuestion}
                    questions={formData?.questions as TQuestion[]}
                  />
                )}
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
    props: {},
  };
};
