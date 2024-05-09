import React from 'react'

type Tprops = {
  feature: string
}
function ComingSoon({ feature }: Tprops) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between p-6">
      <div className="mb-12 flex h-full flex-col justify-center text-center">
        <div className="mb-1 text-4xl font-medium text-muted-foreground">
          Coming soon
        </div>
        <p className="text-base font-thin text-muted-foreground">
          This feature is under construction. Please check back later.
        </p>
      </div>

      <div className="text-sm font-thin text-muted-foreground">
        <p>
          <span>Need help? </span>
          <a
            href={`mailto:ksushant6566@gmail.com?subject=Need help with FormOnce&body=Hi, I need help with the ${feature} feature in formOnce.`}
            className="text-primary"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}

export default ComingSoon
