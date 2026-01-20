import { Link, useLocation } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ComputerIcon,
  FloppyDiskIcon,
  LayoutIcon,
  SettingsIcon,
  ShieldIcon,
} from '@hugeicons/core-free-icons'
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
  main: [{ title: 'Dashboard', href: '/', icon: LayoutIcon }],
  compute: [
    { title: 'Instances', href: '/compute/instances', icon: ComputerIcon },
  ],
  storage: [
    { title: 'Volumes', href: '/storage/volumes', icon: FloppyDiskIcon },
  ],
  network: [
    { title: 'Private Networks', href: '/network/private', icon: ShieldIcon },
  ],
  project: [
    { title: 'SSH Keys', href: '/project/ssh-keys', icon: SettingsIcon },
  ],
}

function NavGroup({
  label,
  items,
}: {
  label?: string
  items: Array<{ title: string; href: string; icon: typeof LayoutIcon }>
}) {
  const location = useLocation()

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href))
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link to={item.href} />}
                  isActive={isActive}
                >
                  <HugeiconsIcon icon={item.icon} size={18} />
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
          <HugeiconsIcon icon={LayoutIcon} size={22} />
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
