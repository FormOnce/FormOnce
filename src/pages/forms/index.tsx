import DashboardLayout from "~/layouts/dashboardLayout";
import {
  Icons,
  Button,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export default function Forms() {
  const router = useRouter();

  const onCreateNewForm = () => {
    void router.push("/forms/new");
  };

  return (
    <DashboardLayout title="dashboard">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">All Forms</h2>
        <Button onClick={onCreateNewForm}>
          <Icons.plus className="mr-2 h-4 w-4" />
          Create a new form
        </Button>
      </div>
      <div className="mt-8">
        <AllFormsTable />
      </div>
    </DashboardLayout>
  );
}

export function AllFormsTable() {
  const { data: forms } = api.form.getAll.useQuery();
  return (
    <Table>
      <TableCaption>A list of your recent forms.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Form</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Edited</TableHead>
          {/* <TableHead>Responses</TableHead> */}
          <TableHead>Author</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms?.map((form) => (
          <TableRow key={form.name} className="cursor-pointer">
            <TableCell className="font-medium">{form.name}</TableCell>
            <TableCell>{form.status}</TableCell>
            <TableCell className="text-xs">
              {form.createdAt.toLocaleDateString()}
            </TableCell>
            <TableCell className="text-xs">
              {form.updatedAt.toLocaleDateString()}
            </TableCell>
            {/* <TableCell className="text-xs">{form.}</TableCell> */}
            <TableCell className="text-xs">{form.author?.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
