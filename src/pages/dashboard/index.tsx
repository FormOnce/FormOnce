import { Loader } from 'lucide-react'
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import DashboardLayout from '~/layouts/dashboardLayout'
import { getServerAuthSession } from '~/server/auth'

export default function Forms() {
  const router = useRouter()

  void router.push('/dashboard/forms')

  return (
    <DashboardLayout title="dashboard">
      <div className="flex h-full w-full items-center justify-center">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx)

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
