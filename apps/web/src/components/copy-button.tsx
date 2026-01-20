import { useCallback, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileIcon, Tick02Icon } from '@hugeicons/core-free-icons'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  value: string
  className?: string
  label?: string
}

export function CopyButton({
  value,
  className,
  label = 'Copy',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = value
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [value])

  return (
    <Tooltip>
      <TooltipTrigger
        render={(props) => (
          <button
            {...props}
            type="button"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon-xs' }),
              'h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity',
              className,
            )}
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : label}
          >
            {copied ? (
              <HugeiconsIcon icon={Tick02Icon} size={12} />
            ) : (
              <HugeiconsIcon icon={FileIcon} size={12} />
            )}
          </button>
        )}
      />
      <TooltipContent side="top">{copied ? 'Copied!' : label}</TooltipContent>
    </Tooltip>
  )
}

interface CopyableTextProps {
  value: string
  className?: string
  children?: React.ReactNode
}

export function CopyableText({
  value,
  className,
  children,
}: CopyableTextProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 group', className)}>
      <code className="text-sm">{children ?? value}</code>
      <CopyButton value={value} />
    </span>
  )
}
