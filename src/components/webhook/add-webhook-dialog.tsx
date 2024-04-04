import { CopyIcon } from "@radix-ui/react-icons";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
  FormItem,
  FormField,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
  Form,
  Checkbox,
} from "@components/ui";
import { Eye, EyeIcon, Webhook } from "lucide-react";
import { toast } from "sonner";
import { type TAddWebhookForm, ZAddWebhookForm } from "~/types/webhook.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WebhookTriggerEvent } from "@prisma/client";
import { api } from "~/utils/api";
import { useState } from "react";

type TAddWebhookDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

export function AddWebhookDialog({
  disabled,
  ...props
}: TAddWebhookDialogProps) {
  const { mutateAsync: createWebhook, isLoading } =
    api.webhook.create.useMutation();

  const formSchema = ZAddWebhookForm;

  const form = useForm<TAddWebhookForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      name: "",
      secret: "",
      events: [],
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: TAddWebhookForm) => {
    try {
      await createWebhook(values);
      toast.success("Webhook created successfully", {
        duration: 3000,
        position: "top-center",
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create webhook", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const onError = (error: unknown) => {
    console.error(error);
  };

  const onGenerateSecret = () => {
    form.setValue("secret", Math.random().toString(36).substring(2));
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    props.onOpenChange?.(open);
    if (!open) form.reset();
  };

  const [open, setOpen] = useState(props.open ?? false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={"lg"} disabled={disabled}>
          Add Webhook
          <Webhook className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="my-2">
          <DialogTitle className="flex items-center gap-3">
            <Webhook className="h-6 w-6" /> <span>Add Webhook</span>
          </DialogTitle>
          <DialogDescription>
            Send data to other services with this webhook
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8"
            name="add-webhook-form"
            id="add-webhook-form"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Eg. New user webhook"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique name to easily identify this webhook
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="https://example.com/webhook"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The URL where
                    <span className="mx-1 text-[hsl(280,100%,70%)]">
                      FormOnce
                    </span>
                    will send the webhook data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Webhook events</FormLabel>
              <div className="space-y-3 rounded-md border p-4">
                <FormField
                  control={form.control}
                  name="events"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(
                            WebhookTriggerEvent.RESPONSE_SUBMITTED
                          )}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? [
                                    ...field.value,
                                    WebhookTriggerEvent.RESPONSE_SUBMITTED,
                                  ]
                                : field.value.filter(
                                    (v) =>
                                      v !==
                                      WebhookTriggerEvent.RESPONSE_SUBMITTED
                                  )
                            )
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Response Submitted
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="events"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(
                            WebhookTriggerEvent.RESPONSE_UPDATED
                          )}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? [
                                    ...field.value,
                                    WebhookTriggerEvent.RESPONSE_UPDATED,
                                  ]
                                : field.value.filter(
                                    (v) =>
                                      v !== WebhookTriggerEvent.RESPONSE_UPDATED
                                  )
                            )
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Response Updated
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription>
                The event(s) that will trigger this webhook
              </FormDescription>
              <FormMessage>{form.formState.errors.events?.message}</FormMessage>
            </FormItem>
            <FormField
              control={form.control}
              name="secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook secret</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <div className="relative w-full">
                        <Input
                          type="password"
                          placeholder="Eg. 1a2b3c4d5e"
                          {...field}
                        />
                        <CopyIcon
                          className="absolute right-2 top-2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-accent-foreground"
                          onClick={() => {
                            void navigator.clipboard.writeText(field.value);
                            toast.success("Secret copied to clipboard", {
                              duration: 2000,
                              position: "top-center",
                            });
                          }}
                        />
                        <EyeIcon
                          className="absolute right-8 top-2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-accent-foreground"
                          onClick={() => {
                            const input =
                              // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
                              document.querySelector(
                                "input[name=secret]"
                              ) as HTMLInputElement;
                            input.type =
                              input.type === "password" ? "text" : "password";
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={onGenerateSecret}
                      >
                        Generate
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    A secret key to make sure webhook is from{" "}
                    <span className="mx-0 text-[hsl(280,100%,70%)]">
                      FormOnce
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="my-2 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" form="add-webhook-form" loading={isLoading}>
            {isLoading ? "Creating..." : "Create Webhook"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
