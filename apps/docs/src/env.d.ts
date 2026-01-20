/// <reference types="vite/client" />

declare module '@tanstack/react-start/config' {
  export function defineConfig(config: any): any
}

declare module '@tanstack/react-start/api' {
  export function createAPIFileRoute<T extends string>(
    path: T
  ): (config: {
    GET?: (ctx: any) => Promise<Response> | Response
    POST?: (ctx: any) => Promise<Response> | Response
    PUT?: (ctx: any) => Promise<Response> | Response
    DELETE?: (ctx: any) => Promise<Response> | Response
    PATCH?: (ctx: any) => Promise<Response> | Response
  }) => { APIRoute: any }
}

declare module 'fumadocs-mdx:collections/browser' {
  interface ClientLoader<T> {
    useContent: (path: string, props: T) => React.ReactNode
    preload: (path: string) => Promise<void>
  }

  interface MDXComponent {
    (props: { components?: Record<string, React.ComponentType<any>> }): React.ReactElement
  }

  interface DocsCollection {
    createClientLoader: <T extends object>(config: {
      component: (
        module: {
          toc: any
          frontmatter: { title: string; description?: string; [key: string]: any }
          default: MDXComponent
        },
        props: T
      ) => React.ReactNode
    }) => ClientLoader<T>
  }

  const collections: {
    docs: DocsCollection
  }
  export default collections
}
