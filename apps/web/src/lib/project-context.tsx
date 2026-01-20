import { createContext, useCallback, useContext, useState, useEffect } from 'react'
import { useProjects } from './queries/projects'

interface Project {
  id: string
  name: string
}

interface ProjectContextValue {
  currentProject: Project | null
  projectId: string
  setCurrentProject: (project: Project) => void
  isLoading: boolean
  projects: string[]
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

interface ProjectProviderProps {
  children: React.ReactNode
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects()
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null)

  // Set the first project as default when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && !currentProject) {
      setCurrentProjectState({
        id: projects[0],
        name: `Project ${projects[0].slice(0, 8)}...`,
      })
    }
  }, [projects, currentProject])

  const setCurrentProject = useCallback((project: Project) => {
    setCurrentProjectState(project)
  }, [])

  const projectId = currentProject?.id ?? ''

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        projectId,
        setCurrentProject,
        isLoading: isLoadingProjects,
        projects,
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
