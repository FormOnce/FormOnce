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
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { type Form, FormStatus } from "@prisma/client";

export default function Forms() {
  const router = useRouter();

  const onCreateNewForm = () => {
    void router.push("/dashboard/forms/new");
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
  const router = useRouter();

  const { data: forms, isLoading, refetch } = api.form.getAll.useQuery();
  const {
    mutateAsync: deleteForm,
    isLoading: isDeletingForm,
    variables,
  } = api.form.delete.useMutation();

  const handleClick = (form: Form) => {
    // if form is not published, redirect to form editor
    if (form.status == FormStatus.DRAFT) {
      return void router.push(`/dashboard/forms/${form.id}`);
    }

    // if form is published, redirect to form summary
    return void router.push(`/dashboard/forms/${form.id}/summary`);
  };

  const onDeleteForm = async (formId: string) => {
    await deleteForm({
      id: formId,
    });
    await refetch();
  };

  return (
    <Table>
      <TableCaption>A list of your recent forms</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Form</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Edited</TableHead>
          <TableHead>Responses</TableHead>
          <TableHead>Author</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : null}
        {forms?.map((form) => (
          <TableRow
            key={form.id}
            className="cursor-pointer"
            onClick={() => handleClick(form)}
          >
            <TableCell className="font-medium">{form.name}</TableCell>
            <TableCell>{form.status}</TableCell>
            <TableCell className="text-xs">
              {form.createdAt.toLocaleDateString()}
            </TableCell>
            <TableCell className="text-xs">
              {form.updatedAt.toLocaleDateString()}
            </TableCell>
            <TableCell className="text-xs">
              <div className="w-16 text-center">
                {Number(form.FormResponses?.length).toLocaleString()}
              </div>
            </TableCell>
            <TableCell className="text-xs">{form.author?.name}</TableCell>
            <TableCell className="text-xs">
              <Button
                variant={
                  isDeletingForm && variables?.id === form.id
                    ? "destructive"
                    : "secondary"
                }
                size={"icon"}
                className="hover:bg-destructive/90 hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  void onDeleteForm(form.id);
                }}
                loading={isDeletingForm && variables?.id === form.id}
                noChildOnLoading
              >
                <Icons.trash className="h-5 w-5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
