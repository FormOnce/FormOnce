import DashboardLayout from "~/layouts/dashboardLayout";
import { Button } from "~/components/ui/button";

export default function Folders() {
  return (
    <DashboardLayout title="dashboard">
      <>
        <div className="flex justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Folders</h2>
          <div className="flex items-center space-x-2">
            <Button>All Folders</Button>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
