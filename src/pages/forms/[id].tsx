import DashboardLayout from "~/layouts/dashboardLayout";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
} from "@components/ui";
import { useEffect } from "react";
import { type TQuestion } from "~/types/question.types";
import { AddNewQuestion } from "~/components/form-builder/add-new-question";
import { TextQuestionForm } from "~/components/form-builder/text-question-form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { EditableQuestion } from "~/components/form-builder/editable-question";

type TProps = {
  formId: string;
};

export default function Form(props: TProps) {
  const router = useRouter();

  console.log(props.formId);

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
          ...(formData?.formSchema?.questions as TQuestion[]),
          values,
        ],
      },
    }).then(() => {
      void refreshFormData();
    });
  };

  // TODO: implement edit question
  const onEditQuestion = (values: TQuestion) => {};

  return (
    <DashboardLayout title="dashboard">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={50} maxSize={60} className="">
          <ScrollArea className="h-full pr-8">
            <div className="flex flex-col gap-6">
              {formData?.formSchema?.questions.map(
                (question: TQuestion, index: number) => {
                  switch (question.type) {
                    case "text":
                      return (
                        <EditableQuestion
                          editQuestion={onEditQuestion}
                          {...question}
                          index={index + 1}
                        />
                      );
                    default:
                      return null;
                  }
                }
              )}
              <AddNewQuestion onAddQuestion={onAddQuestion} />
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Preview</p>
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
