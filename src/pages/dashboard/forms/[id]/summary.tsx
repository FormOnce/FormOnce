import DashboardLayout from "~/layouts/dashboardLayout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icons,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/ui";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { FormStatus } from "@prisma/client";
import { CalendarDateRangePicker } from "~/components/date-range-picker";
import calculatePercentageDelta from "~/utils/responses/calculatePercentageDelta";
import OverViewChart from "~/components/responses/overview-chart";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
import ResponsesTable from "~/components/responses/responses-table";

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

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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
        toast.success("Form published and link copied to clipboard", {
          position: "top-center",
          duration: 1000,
        });
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

  const cards = useMemo(() => {
    let formResponses = formData?.FormResponses ?? [];
    let formViews = formData?.FormViews ?? [];

    // filter formResponses and formViews based on dateRange
    if (dateRange?.from && dateRange?.to) {
      formResponses = formResponses.filter((response) => {
        const date = new Date(response.createdAt);
        return date >= dateRange.from! && date <= dateRange.to!;
      });

      formViews = formViews.filter((view) => {
        const date = new Date(view.createdAt);
        return date >= dateRange.from! && date <= dateRange.to!;
      });
    }

    // calculate percentage delta

    // calculate formView percentage delta
    const formViewDeltaInNumber = calculatePercentageDelta(formViews ?? []);
    let formViewDelta = "";

    if (formViewDeltaInNumber) {
      formViewDelta =
        formViewDeltaInNumber > 0
          ? `+${formViewDeltaInNumber}% in last 7 days`
          : `${formViewDeltaInNumber}% in last 7 days`;
    }

    // calculate formStarts percentage delta
    const formStartsDeltaInNumber = calculatePercentageDelta(
      formResponses ?? []
    );
    let formStartsDelta = "";

    if (formStartsDeltaInNumber) {
      formStartsDelta =
        formStartsDeltaInNumber > 0
          ? `+${formStartsDeltaInNumber}% in last 7 days`
          : `${formStartsDeltaInNumber}% in last 7 days`;
    }

    // calculate formResponse percentage delta
    const completedResponses = formResponses.filter((r) => r.completed) ?? [];

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
    const totalTime = formResponses.reduce((acc, curr) => {
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
        value: formViews.length ?? "-",
        description: formViewDelta,
      },
      {
        title: "Starts",
        value: formResponses.length ?? "-",
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
  }, [formData, dateRange]);

  return (
    <DashboardLayout title="dashboard">
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full justify-between">
          <h1 className="text-3xl font-bold">{formData?.name}</h1>
          <div className="flex gap-4">
            <CalendarDateRangePicker onChange={setDateRange} />
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
        <div className="my-6 px-4">
          {formData?.FormResponses ? (
            <Tabs defaultValue="overview" className="">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="responses">Responses</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mr-14 py-6">
                <OverViewChart
                  formViews={formData?.FormViews}
                  formResponses={formData?.FormResponses}
                  dateRange={dateRange}
                />
              </TabsContent>
              <TabsContent value="responses" className="">
                <ResponsesTable data={formData.FormResponses} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex h-80 items-center justify-center">
              <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
          )}
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
