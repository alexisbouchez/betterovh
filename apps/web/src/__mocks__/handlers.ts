import { HttpResponse, http } from 'msw'

export const handlers = [
  // Account info
  http.get('*/me', () => {
    return HttpResponse.json({
      firstname: 'John',
      name: 'Doe',
      email: 'john@example.com',
    })
  }),

  // Cloud projects
  http.get('*/cloud/project', () => {
    return HttpResponse.json(['project-1', 'project-2'])
  }),

  // Instances
  http.get('*/cloud/project/:projectId/instance', () => {
    return HttpResponse.json([
      { id: 'i-1', name: 'web-server', status: 'ACTIVE', region: 'GRA11' },
      { id: 'i-2', name: 'db-server', status: 'STOPPED', region: 'SBG5' },
    ])
  }),

  http.post('*/cloud/project/:projectId/instance', async ({ request }) => {
    const body = (await request.json()) as { name: string; region: string }
    return HttpResponse.json(
      {
        id: 'i-new',
        name: body.name,
        status: 'BUILD',
        region: body.region,
      },
      { status: 201 },
    )
  }),

  http.delete('*/cloud/project/:projectId/instance/:instanceId', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
