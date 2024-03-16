import DashboardLayout from "~/layouts/dashboardLayout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icons,
} from "@components/ui";
import { useEffect, useMemo } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { FormStatus } from "@prisma/client";
import { CalendarDateRangePicker } from "~/components/date-range-picker";
import calculatePercentageDelta from "~/utils/responses/calculatePercentageDelta";

type TProps = {
  formId: string;
};

export default function Summary(props: TProps) {
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
      includeResponses: true,
      includeViews: true,
    },
    {
      enabled: !!props.formId && props.formId !== "new",
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const { mutateAsync: publishForm, isLoading: isPublishingForm } =
    api.form.publish.useMutation();
  const { mutateAsync: unpublishForm, isLoading: isUnpublishingForm } =
    api.form.unpublish.useMutation();

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
    } else {
      await unpublishForm({
        id: props.formId,
      }).then(() => {
        void refreshFormData();
      });
    }
  };

  const cards = useMemo(() => {
    // calculate percentage delta

    // calculate formView percentage delta
    const formViewDeltaInNumber = calculatePercentageDelta(
      formData?.FormViews ?? []
    );
    let formViewDelta = "";

    if (formViewDeltaInNumber) {
      formViewDelta =
        formViewDeltaInNumber > 0
          ? `+${formViewDeltaInNumber}% in last 7 days`
          : `${formViewDeltaInNumber}% in last 7 days`;
    }

    // calculate formStarts percentage delta
    const formStartsDeltaInNumber = calculatePercentageDelta(
      formData?.FormResponses ?? []
    );
    let formStartsDelta = "";

    if (formStartsDeltaInNumber) {
      formStartsDelta =
        formStartsDeltaInNumber > 0
          ? `+${formStartsDeltaInNumber}% in last 7 days`
          : `${formStartsDeltaInNumber}% in last 7 days`;
    }

    // calculate formResponse percentage delta
    const completedResponses =
      formData?.FormResponses.filter((r) => r.completed) ?? [];

    const formResponseDeltaInNumber =
      calculatePercentageDelta(completedResponses);
    let formResponseDelta = "";

    if (formResponseDeltaInNumber) {
      formResponseDelta =
        formResponseDeltaInNumber > 0
          ? `+${formResponseDelta}% in last 7 days`
          : `${formResponseDelta}% in last 7 days`;
    }

    // calculate average time
    const totalTime = formData?.FormResponses.reduce((acc, curr) => {
      // if response in not completed, skip
      if (!curr.completed) return acc;

      // calculate time spent in seconds
      const timeSpent =
        new Date(curr.completed).getTime() - new Date(curr.createdAt).getTime();
      return acc + timeSpent / 1000;
    }, 0);

    const averageTime = totalTime
      ? totalTime / (completedResponses?.length ?? 1)
      : 0;

    return [
      {
        title: "Views",
        value: formData?.FormViews.length ?? "-",
        description: formViewDelta,
      },
      {
        title: "Starts",
        value: formData?.FormResponses.length ?? "-",
        description: formStartsDelta,
      },
      {
        title: "Responses",
        value: completedResponses?.length ?? "-",
        description: formResponseDelta,
      },
      {
        title: "Average time",
        value: averageTime
          ? // convert seconds to minutes and seconds
            `${Math.floor(averageTime / 60)}m ${Math.floor(averageTime % 60)}s`
          : "-",
      },
    ];
  }, [formData]);

  return (
    <DashboardLayout title="dashboard">
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full justify-between">
          <h1 className="text-3xl font-bold">{formData?.name}</h1>
          <div className="flex gap-4">
            <CalendarDateRangePicker />
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
        <div className="grid grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text font-medium">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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
