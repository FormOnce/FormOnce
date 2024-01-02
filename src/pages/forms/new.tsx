import DashboardLayout from "~/layouts/dashboardLayout";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui";
import { useState } from "react";
import { type TQuestion } from "~/types/question.types";
import AddNewQuestion from "~/components/form-builder/add-new-question";

export default function Form() {
  const [questions, setQuestions] = useState<TQuestion[]>([]);

  return (
    <DashboardLayout title="dashboard">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={40} maxSize={60} className="pr-8 pt-8">
          <AddNewQuestion />
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
