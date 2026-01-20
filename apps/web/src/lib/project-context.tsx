import { createContext, useCallback, useContext, useState } from 'react'

interface Project {
  id: string
  name: string
}

interface ProjectContextValue {
  currentProject: Project | null
  projectId: string
  setCurrentProject: (project: Project) => void
  isLoading: boolean
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

interface ProjectProviderProps {
  children: React.ReactNode
  defaultProjectId?: string
}

export function ProjectProvider({
  children,
  defaultProjectId = 'default',
}: ProjectProviderProps) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>({
    id: defaultProjectId,
    name: 'Default Project',
  })
  const [isLoading] = useState(false)

  const setCurrentProject = useCallback((project: Project) => {
    setCurrentProjectState(project)
  }, [])

  const projectId = currentProject?.id ?? defaultProjectId

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        projectId,
        setCurrentProject,
        isLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}

export function useProjectId() {
  const { projectId } = useProject()
  return projectId
}
