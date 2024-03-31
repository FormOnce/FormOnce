import { Icons } from "@components/ui";
import { useEffect } from "react";
import { type TQuestion } from "~/types/question.types";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import type { TFormSchema } from "~/types/form.types";
import { FormLayout } from "~/layouts/formLayout";
import { LiveForm } from "~/components/form-builder/liveForm";

type TProps = {
  formId: string;
};

export default function Form(props: TProps) {
  const router = useRouter();
  const {
    data: formData,
    isLoading: isLoadingFormData,
    isError: isFormInvalid,
  } = api.form.getPublicFormData.useQuery(
    {
      id: props.formId,
      increaseViewCount: true,
    },
    {
      enabled: !!props.formId && props.formId !== "new",
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  // check if formId is valid, if unvalid redirect to fallback page
  useEffect(() => {
    if (isFormInvalid) {
      // invalid form id
      void router.push("/forms/invalid-form");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormInvalid]);

  return (
    <FormLayout title="Form">
      {isLoadingFormData ? (
        <div className="flex h-full items-center justify-center">
          <Icons.spinner className="mb-10 h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {formData?.form?.formSchema && (
            <LiveForm
              formId={props.formId}
              formSchema={formData.form?.formSchema as TFormSchema}
              questions={formData.form?.questions as TQuestion[]}
              formViewId={formData.formViewId}
            />
          )}
        </>
      )}
    </FormLayout>
  );
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      formId: ctx.query.id,
    },
  };
};
