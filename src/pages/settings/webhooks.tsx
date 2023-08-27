import DashboardLayout from "~/layouts/dashboardLayout";
import { Button } from "~/components/ui/button";

export default function Webhooks() {
  return (
    <DashboardLayout title="dashboard">
      <>
        <div className="flex justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>
          <div className="flex items-center space-x-2">
            <Button>Manage Webhooks</Button>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
