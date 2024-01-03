import DashboardLayout from "~/layouts/dashboardLayout";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
} from "@components/ui";
import { useState } from "react";
import { type TQuestion } from "~/types/question.types";
import AddNewQuestion from "~/components/form-builder/add-new-question";

export default function Form() {
  const [questions, setQuestions] = useState<TQuestion[]>([]);

  return (
    <DashboardLayout title="dashboard">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={50} maxSize={60} className="">
          <ScrollArea className="flex h-full flex-col gap-4 pr-8 pt-8">
            <AddNewQuestion />
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
