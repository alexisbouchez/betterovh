import { HugeiconsIcon } from '@hugeicons/react'
import { ComputerIcon, MoonIcon, SunIcon } from '@hugeicons/core-free-icons'
import { useTheme } from './theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="size-7 inline-flex items-center justify-center rounded-md hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[2px] outline-none"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <HugeiconsIcon icon={MoonIcon} size={16} />
        ) : theme === 'light' ? (
          <HugeiconsIcon icon={SunIcon} size={16} />
        ) : (
          <HugeiconsIcon icon={ComputerIcon} size={16} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <HugeiconsIcon icon={SunIcon} size={16} className="mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <HugeiconsIcon icon={MoonIcon} size={16} className="mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <HugeiconsIcon icon={ComputerIcon} size={16} className="mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
