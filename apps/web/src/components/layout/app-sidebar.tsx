import { Link, useLocation } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navItems = {
  main: [{ title: 'Dashboard', href: '/', icon: '🏠' }],
  compute: [
    { title: 'Instances', href: '/compute/instances', icon: '💻' },
  ],
  storage: [
    { title: 'Volumes', href: '/storage/volumes', icon: '💾' },
  ],
  network: [
    { title: 'Private Networks', href: '/network/private', icon: '🔒' },
  ],
  project: [
    { title: 'SSH Keys', href: '/project/ssh-keys', icon: '🔑' },
  ],
}

function NavGroup({
  label,
  items,
}: {
  label?: string
  items: Array<{ title: string; href: string; icon: string }>
}) {
  const location = useLocation()

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href))
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton render={<Link to={item.href} />} isActive={isActive}>
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">☁️</span>
          <span>BetterOVH</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup items={navItems.main} />
        <NavGroup label="Compute" items={navItems.compute} />
        <NavGroup label="Storage" items={navItems.storage} />
        <NavGroup label="Network" items={navItems.network} />
        <NavGroup label="Project" items={navItems.project} />
      </SidebarContent>
    </Sidebar>
  )
}
