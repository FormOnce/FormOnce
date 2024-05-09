import { Button } from '~/components/ui/button'
import DashboardLayout from '~/layouts/dashboardLayout'

export default function Folder() {
  return (
    <DashboardLayout title="dashboard">
      <>
        <div className="flex justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">folder</h2>
          <div className="flex items-center space-x-2">
            <Button>Folder</Button>
          </div>
        </div>
      </>
    </DashboardLayout>
  )
}
