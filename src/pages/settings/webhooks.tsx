import DashboardLayout from "~/layouts/dashboardLayout";
import { Button } from "~/components/ui/button";
import {
  Icons,
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
import { Loader2 } from "lucide-react";
import { AddWebhookDialog } from "~/components/webhook/add-webhook-dialog";
import { toast } from "sonner";

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
  const { data: webhooks, isLoading, refetch } = api.webhook.getAll.useQuery();

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
          <TableHead>Event</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Secret</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Enabled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6}>
              <div className="my-4 flex justify-center">
                <Loader2 className="animate-spin" />{" "}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          webhooks?.map((webhook) => (
            <TableRow key={webhook.id}>
              <TableCell>{webhook.name}</TableCell>
              <TableCell>
                <ul className="capitalize">
                  {webhook.events.map((event) => (
                    <li key={event}>{event.replace("_", " ").toLowerCase()}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="max-w-[15rem] truncate" title={webhook.url}>
                {webhook.url}
              </TableCell>
              <TableCell>{webhook.secret}</TableCell>
              <TableCell>{webhook.createdAt.toLocaleDateString()}</TableCell>
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
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
