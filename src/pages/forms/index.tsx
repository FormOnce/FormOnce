import DashboardLayout from "~/layouts/dashboardLayout";
import { Button } from "~/components/ui/button";

export default function Forms() {
  return (
    <DashboardLayout title="dashboard">
      <>
        <div className="flex justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">All Forms</h2>
          <div className="flex items-center space-x-2">
            <Button>All forms</Button>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
