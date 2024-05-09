import type { Workspace } from '@prisma/client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Store = {
  selectedWorkspace: {
    id: string
    name: string
  }
  setSelectedWorkspace: (workspace: Pick<Workspace, 'name' | 'id'>) => void
}

export const useWorkspaceStore = create<Store>()(
  persist(
    (set) => ({
      selectedWorkspace: {
        id: '',
        name: '',
      },
      setSelectedWorkspace: (workspace: Pick<Workspace, 'name' | 'id'>) =>
        set(() => ({
          selectedWorkspace: {
            id: workspace.id,
            name: workspace.name,
          },
        })),
    }),
    { name: 'workspace-storage' },
  ),
)
