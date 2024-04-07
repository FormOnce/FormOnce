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
import { toast } from "sonner";
import type { ApiKey } from "@prisma/client";
import { useState } from "react";
import { AddApiKeyDialog } from "~/components/api-keys/add-api-key-dialog";

export default function ApiKeys() {
  return (
    <DashboardLayout title="dashboard">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Api Keys</h2>
          <div className="flex items-center space-x-2">
            <AddApiKeyDialog />
          </div>
        </div>
        <div>
          <p className="font-thin text-muted-foreground">
            Api keys are used to securely authenticate your application with the
            API.
            <br />
            <span className="my-1 line-clamp-1">
              You can create and manage keys on this page.
            </span>
          </p>
        </div>
        <div>
          <ApiKeysTable />
        </div>
      </div>
    </DashboardLayout>
  );
}

const ApiKeysTable = () => {
  const {
    data: keys,
    isLoading,
    refetch,
  } = api.apiKey.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutateAsync: enableKey } = api.apiKey.enable.useMutation();
  const { mutateAsync: disableKey } = api.apiKey.disable.useMutation();

  const onToggleWebhook = async (id: string, enabled: boolean) => {
    if (enabled) {
      await enableKey({ id });
      toast.success("key enabled", {
        duration: 3000,
        position: "top-center",
      });
    } else {
      await disableKey({ id });
      toast.success("key disabled", {
        duration: 3000,
        position: "top-center",
      });
    }
    await refetch();
  };

  return (
    <Table>
      <TableCaption>A list of all your keys in this workspace</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Secret Key</TableHead>
          <TableHead>Enabled</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Used</TableHead>
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
          keys?.map((key) => (
            <TableRow key={key.id}>
              <TableCell className="max-w-[12rem] truncate">
                <p>
                  {key.name}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    created by {key.createdBy.name}{" "}
                  </span>
                </p>
              </TableCell>
              <TableCell className="flex max-w-[12rem] items-center text-base">
                {key.key.slice(0, 3)}
                <span className="mx-0.5">. . .</span>
                {key.key.slice(-4)}
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Switch
                        checked={key.enabled}
                        onCheckedChange={(checked) =>
                          onToggleWebhook(key.id, checked)
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {key.enabled ? "Disable" : "Enable"} key
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="max-w-[12rem]">
                {new Date(key.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="max-w-[12rem]">{"Never"}</TableCell>
              <TableCell className="flex gap-2">
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <DeleteApiKeyDialog refetch={refetch} apiKey={key} />
                    </TooltipTrigger>
                    <TooltipContent>Delete key</TooltipContent>
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
  apiKey: ApiKey;
  refetch: () => Promise<unknown>;
};
const DeleteApiKeyDialog = ({ refetch, apiKey }: DeleteWebhookDialogProps) => {
  const { mutateAsync: deleteApiKey, isLoading } =
    api.apiKey.delete.useMutation();

  const onDeleteApiKey = async () => {
    await deleteApiKey({ id: apiKey.id });
    toast.success("key deleted", {
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
          <AlertDialogTitle>Delete key {apiKey.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this key. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-2">
          <Label className="flex items-center">
            <span className="text-sm">Confirm by typing : </span>
            <span className="mx-1 text-sm text-red-500">
              Delete {apiKey.name}{" "}
            </span>{" "}
          </Label>
          <Input onChange={(e) => setValue(e.target.value)} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteApiKey}
            disabled={value !== `Delete ${apiKey.name}`}
            className="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
