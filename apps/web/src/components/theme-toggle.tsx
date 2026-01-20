import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from './theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="size-7 inline-flex items-center justify-center rounded-md hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[2px] outline-none"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <span>🌙</span>
        ) : theme === 'light' ? (
          <span>☀️</span>
        ) : (
          <span>💻</span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <span className="mr-2">☀️</span>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <span className="mr-2">🌙</span>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <span className="mr-2">💻</span>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
