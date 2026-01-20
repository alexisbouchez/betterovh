import { useCallback, useRef, type KeyboardEvent } from 'react'

interface UseTableKeyboardNavOptions<T> {
  items: T[]
  onSelect?: (item: T) => void
  getItemId: (item: T) => string
}

export function useTableKeyboardNav<T>({ items, onSelect, getItemId }: UseTableKeyboardNavOptions<T>) {
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map())

  const setRowRef = useCallback(
    (id: string) => (el: HTMLTableRowElement | null) => {
      if (el) {
        rowRefs.current.set(id, el)
      } else {
        rowRefs.current.delete(id)
      }
    },
    []
  )

  const handleKeyDown = useCallback(
    (item: T, index: number) => (e: KeyboardEvent<HTMLTableRowElement>) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          onSelect?.(item)
          break
        case 'ArrowDown':
          e.preventDefault()
          if (index < items.length - 1) {
            const nextItem = items[index + 1]
            const nextId = getItemId(nextItem)
            rowRefs.current.get(nextId)?.focus()
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (index > 0) {
            const prevItem = items[index - 1]
            const prevId = getItemId(prevItem)
            rowRefs.current.get(prevId)?.focus()
          }
          break
        case 'Home':
          e.preventDefault()
          if (items.length > 0) {
            const firstId = getItemId(items[0])
            rowRefs.current.get(firstId)?.focus()
          }
          break
        case 'End':
          e.preventDefault()
          if (items.length > 0) {
            const lastId = getItemId(items[items.length - 1])
            rowRefs.current.get(lastId)?.focus()
          }
          break
      }
    },
    [items, onSelect, getItemId]
  )

  return {
    setRowRef,
    handleKeyDown,
    getRowProps: (item: T, index: number) => ({
      ref: setRowRef(getItemId(item)),
      tabIndex: 0,
      onKeyDown: handleKeyDown(item, index),
      role: 'row' as const,
    }),
  }
}
