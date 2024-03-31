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
} from "@components/ui";
import { Share } from "lucide-react";
import { toast } from "sonner";

type TShareDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  link: string;
};

export function ShareDialog({
  open,
  onOpenChange,
  disabled,
  link,
}: TShareDialogProps) {
  const handleCopy = () => {
    void navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard", {
      position: "top-center",
      duration: 1500,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          Share
          <Share className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to fill this
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={link} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
