import DashboardLayout from "~/layouts/dashboardLayout";
import { Button } from "~/components/ui/button";

export default function Keys() {
  return (
    <DashboardLayout title="dashboard">
      <>
        <div className="flex justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Keys</h2>
          <div className="flex items-center space-x-2">
            <Button>Manage Keys</Button>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
