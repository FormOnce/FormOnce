import { Play } from "lucide-react";
import { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "~/components/ui";
import { TQuestion } from "~/types/question.types";
import { api } from "~/utils/api";
import { EditableQuestionDialog } from "../editable-question-modal";
import { handleStyleLeft, handleStyleRight } from "./utils";
import { VideoUploadDialog } from "./VideoUploadDialog";

type QuestionNodeProps = {
  data: {
    question: TQuestion;
    label: string;
    formId: string;
    refreshFormData: () => void;
  };
};

const QuestionNode = ({ data }: QuestionNodeProps) => {
  const { question, label } = data;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { mutateAsync: editQuestion } = api.form.editQuestion.useMutation();
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const onEdit = async (values: TQuestion) => {
    await editQuestion({
      formId: data.formId,
      question: {
        ...values,
        id: question.id!,
      },
    });
    data.refreshFormData();
    setEditDialogOpen(false);
  };

  const openEditDialog = () => {
    setEditDialogOpen(true);
  };

  const openVideoDialog = () => {
    setVideoDialogOpen(true);
  };

  return (
    <div className="flex flex-col border-2 border-violet-800 hover:border-violet-500 [&>div:first-child]:hover:border-violet-500 rounded-lg bg-primary-foreground w-64 h-56 hover:scale-105 transition-all duration-200">
      <div className="px-4 py-2 bg-primary-foreground rounded-t-lg border-b-2  border-violet-800">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </p>
      </div>
      <div className="flex h-full rounded-b-lg">
        <div className="w-1/2 h-full rounded-bl-lg bg-black opacity-50 hover:opacity-100 flex justify-center items-center border-r border-violet-500 [&>*:first-child]:hover:bg-violet-800 [&>*:first-child]:hover:text-white [&>*:first-child]:hover:h-10 [&>*:first-child]:hover:w-10">
          <Button
            variant={"secondary"}
            size={"icon"}
            className="rounded-full p-2 hover:w-10 hover:h-10 hover:bg-violet-800 hover:text-white"
            onClick={openVideoDialog}
          >
            <Play size={32} className="text-violet-300 ml-0.5" />
          </Button>
        </div>
        <div
          className="w-1/2 h-full flex flex-col justify-center items-center gap-4 [&>button]:hover:bg-violet-600 cursor-pointer"
          onClick={openEditDialog}
        >
          <Button variant={"secondary"} size={"sm"} className="w-[70%] h-5" />
          <Button variant={"secondary"} size={"sm"} className="w-[70%] h-5" />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyleRight}
      />
      <Handle type="target" position={Position.Left} style={handleStyleLeft} />
      <EditableQuestionDialog
        {...question}
        isOpen={editDialogOpen}
        setIsOpen={setEditDialogOpen}
        editQuestion={onEdit}
      />
      <VideoUploadDialog
        isOpen={videoDialogOpen}
        setIsOpen={setVideoDialogOpen}
      />
    </div>
  );
};

export default memo(QuestionNode);
