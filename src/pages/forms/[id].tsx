import DashboardLayout from "~/layouts/dashboardLayout";
import {
  Icons,
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

type TProps = {
  formId: string;
};

export default function Form(props: TProps) {
  const router = useRouter();
  const {
    data: formData,
    // isLoading: isFormLoading,
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
  const { mutateAsync: updateForm, isLoading: isUpdatingForm } =
    api.form.update.useMutation();

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

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
        formSchema: {
          questions: [values],
        },
      }).then((res) => {
        void router.push(`/forms/${res.id}`);
      });
      return;
    }

    // else add question to form
    void updateForm({
      id: props.formId,
      formSchema: {
        questions: [
          ...(formData?.formSchema as TFormSchema)?.questions,
          values,
        ],
      },
    }).then(() => {
      void refreshFormData();
    });
  };

  // TODO: implement edit question
  const onEditQuestion = (values: TQuestion) => {
    console.log(values);
  };

  return (
    <DashboardLayout title="dashboard">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={50} maxSize={60} className="h-full">
          <ScrollArea className="h-full pr-8">
            <div className="flex h-full flex-col gap-6">
              {(formData?.formSchema as TFormSchema)?.questions.map(
                (question: TQuestion, index: number) => {
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
                }
              )}
              {isUpdatingForm || isCreatingForm ? (
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
          <div className="flex flex-col gap-8 p-4">
            <p className="text-center text-muted-foreground">Preview</p>
            <Preview
              formSchema={formData?.formSchema as TFormSchema}
              currentQuestionIdx={currentQuestion}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
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
