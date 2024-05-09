import Link from 'next/link'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/utils/cn'
import { TeamSwitcher } from './nav'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
type SidebarItem = {
  name: string
  link: string
  icon: React.ReactNode
}

type SidebarGroup = {
  name: string
  items: SidebarItem[]
}

const sidebarGroups: SidebarGroup[] = [
  {
    name: 'Dashboard',
    items: [
      {
        name: 'All Forms',
        link: '/dashboard/forms',
        icon: (
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        ),
      },
      // {
      //   name: "Folders",
      //   link: "/dashboard/folders",
      //   icon: (
      //     <svg
      //       width="15"
      //       height="15"
      //       viewBox="0 0 15 15"
      //       fill="none"
      //       xmlns="http://www.w3.org/2000/svg"
      //     >
      //       <path
      //         d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z"
      //         fill="currentColor"
      //         fillRule="evenodd"
      //         clipRule="evenodd"
      //       ></path>
      //     </svg>
      //   ),
      // },
      {
        name: 'Templates',
        link: '/dashboard/templates',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-layout-template"
          >
            <rect width="18" height="7" x="3" y="3" rx="1" />
            <rect width="9" height="7" x="3" y="14" rx="1" />
            <rect width="5" height="7" x="16" y="14" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    name: 'Settings',
    items: [
      {
        name: 'Keys',
        link: '/settings/api-keys',
        icon: (
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        ),
      },
      {
        name: 'Webhooks',
        link: '/settings/webhooks',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-webhook"
          >
            <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
            <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
            <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
          </svg>
        ),
      },
    ],
  },
]

const SideBarGroup = ({ name, items }: SidebarGroup) => {
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{name}</h2>
      <div className="space-y-1">
        {items.map((item, i) => (
          <SidebarItem key={i} {...item} />
        ))}
      </div>
    </div>
  )
}

const SidebarItem = ({ name, icon, link }: SidebarItem) => {
  return (
    <Link
      href={link}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'w-full justify-start',
      )}
    >
      <span className="mr-2 h-4 w-4">{icon}</span>
      {name}
    </Link>
  )
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn('border-r pb-12', className)}>
      <div className="px-4 py-4">
        <TeamSwitcher />
      </div>
      <div className="space-y-8 py-4">
        {sidebarGroups.map((sidebarGroup, i) => (
          <SideBarGroup key={i} {...sidebarGroup} />
        ))}
      </div>
    </div>
  )
}
