import DashboardLayout from "~/layouts/dashboardLayout";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Icons,
  Input,
  Label,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui";
import { api } from "~/utils/api";
import { Edit, Loader2 } from "lucide-react";
import { AddWebhookDialog } from "~/components/webhook/add-webhook-dialog";
import { toast } from "sonner";
import type { Webhook } from "@prisma/client";
import { useState } from "react";

export default function Webhooks() {
  return (
    <DashboardLayout title="dashboard">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>
          <div className="flex items-center space-x-2">
            <AddWebhookDialog />
          </div>
        </div>
        <div>
          <p className="font-thin text-muted-foreground">
            Webhooks are a way to send data to other services when certain
            events happen in your workspace.
            <br />
            <span className="my-1 line-clamp-1">
              You can create and manage webhooks on this page.
            </span>
          </p>
        </div>
        <div>
          <WebhookTable />
        </div>
      </div>
    </DashboardLayout>
  );
}

const WebhookTable = () => {
  const {
    data: webhooks,
    isLoading,
    refetch,
  } = api.webhook.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutateAsync: enableWebhook } = api.webhook.enable.useMutation();
  const { mutateAsync: disableWebhook } = api.webhook.disable.useMutation();

  const onToggleWebhook = async (id: string, enabled: boolean) => {
    if (enabled) {
      await enableWebhook({ id });
      toast.success("Webhook enabled", {
        duration: 3000,
        position: "top-center",
      });
    } else {
      await disableWebhook({ id });
      toast.success("Webhook disabled", {
        duration: 3000,
        position: "top-center",
      });
    }
    await refetch();
  };

  return (
    <Table>
      <TableCaption>A list of all your webhooks in this workspace</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Webhook</TableHead>
          <TableHead>Events</TableHead>
          <TableHead>URL</TableHead>
          {/* <TableHead>Created</TableHead> */}
          <TableHead>Enabled</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5}>
              <div className="my-4 flex justify-center">
                <Loader2 className="animate-spin" />{" "}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          webhooks?.map((webhook) => (
            <TableRow key={webhook.id}>
              <TableCell className="max-w-[12rem] truncate">
                <p>
                  {webhook.name}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    {webhook.id}
                  </span>
                </p>
              </TableCell>
              <TableCell>
                <ul className="text-xs capitalize">
                  {webhook.events.map((event) => (
                    <li key={event}>{event.replace("_", " ").toLowerCase()}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="max-w-[12rem] truncate" title={webhook.url}>
                {webhook.url}
              </TableCell>
              {/* <TableCell>{webhook.createdAt.toLocaleDateString()}</TableCell> */}
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Switch
                        checked={webhook.enabled}
                        onCheckedChange={(checked) =>
                          onToggleWebhook(webhook.id, checked)
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {webhook.enabled ? "Disable" : "Enable"} webhook
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="flex gap-2">
                <DeleteWebhookDialog refetch={refetch} webhook={webhook} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="secondary" size="icon" disabled>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Coming soon</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

type DeleteWebhookDialogProps = {
  webhook: Webhook;
  refetch: () => Promise<unknown>;
};
const DeleteWebhookDialog = ({
  refetch,
  webhook,
}: DeleteWebhookDialogProps) => {
  const { mutateAsync: deleteWebhook, isLoading } =
    api.webhook.delete.useMutation();

  const onDeleteWebhook = async () => {
    await deleteWebhook({ id: webhook.id });
    toast.success("Webhook deleted", {
      duration: 3000,
      position: "top-center",
    });
    await refetch();
  };

  const [value, setValue] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="secondary"
          size="icon"
          className="hover:bg-destructive/90 hover:text-destructive-foreground"
        >
          <Icons.trash className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-max">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete webhook {webhook.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this webhook. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-2">
          <Label className="flex items-center">
            <span className="text-sm">Confirm by typing : </span>
            <span className="mx-1 text-sm text-red-500">
              Delete {webhook.name}{" "}
            </span>{" "}
          </Label>
          <Input onChange={(e) => setValue(e.target.value)} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteWebhook}
            disabled={value !== `Delete ${webhook.name}`}
            className="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
