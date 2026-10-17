import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '../../utils/cn'

import type { ComponentProps } from 'react'
import { Badge } from './Badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './Command'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import { Separator } from './Separator'

const BADGE_VARIANTS = {
  default: 'default',
  secondary: 'secondary',
  destructive: 'destructive',
  inverted: 'outline',
} satisfies Record<string, ComponentProps<typeof Badge>['variant']>

interface MultiSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  onValueChange: (value: string[]) => void
  value?: string[]
  defaultValue?: string[]
  placeholder?: string
  variant?: keyof typeof BADGE_VARIANTS
  maxCount?: number
  modalPopover?: boolean
  className?: string
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant = 'default',
      value,
      defaultValue = [],
      placeholder = 'Select options',
      maxCount = 3,
      modalPopover = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const selectedValues = value ?? uncontrolled

    const setSelectedValues = (next: string[]) => {
      if (value === undefined) setUncontrolled(next)
      onValueChange(next)
    }

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true)
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues]
        newSelectedValues.pop()
        setSelectedValues(newSelectedValues)
      }
    }

    const toggleOption = (option: string) => {
      setSelectedValues(
        selectedValues.includes(option)
          ? selectedValues.filter((v) => v !== option)
          : [...selectedValues, option],
      )
    }

    const handleClear = () => {
      setSelectedValues([])
    }

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev)
    }

    const clearExtraOptions = () => {
      setSelectedValues(selectedValues.slice(0, maxCount))
    }

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear()
      } else {
        setSelectedValues(options.map((option) => option.value))
      }
    }

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              'flex h-auto min-h-[34px] w-full items-center justify-between gap-2 rounded-md border border-strong bg-alternative p-1 text-xs ring-border-strong ring-offset-background-control transition-all duration-200 hover:border-stronger hover:bg-selection focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-muted',
              'data-[state=open]:border-stronger data-[state=open]:bg-selection',
              className,
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center gap-1">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value)
                    const IconComponent = option?.icon
                    return (
                      <Badge key={value} variant={BADGE_VARIANTS[variant]}>
                        {IconComponent && <IconComponent className="size-2.5" />}
                        <span>{option?.label}</span>
                        <span className="-mr-0.5 ml-1 flex items-center">
                          <XCircle
                            className="size-3 cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation()
                              toggleOption(value)
                            }}
                          />
                        </span>
                      </Badge>
                    )
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge variant="outline">
                      <span>{`+ ${selectedValues.length - maxCount} more`}</span>
                      <span className="-mr-0.5 ml-1 flex items-center">
                        <XCircle
                          className="size-3 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation()
                            clearExtraOptions()
                          }}
                        />
                      </span>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="mx-2 h-4 w-4 cursor-pointer text-foreground-lighter hover:text-foreground-light"
                    strokeWidth={1.5}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleClear()
                    }}
                  />
                  <Separator orientation="vertical" className="flex h-full min-h-5" />
                  <ChevronDown className="mx-2 h-4 w-4 text-foreground-lighter" strokeWidth={1.5} />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-2 text-foreground-lighter">{placeholder}</span>
                <ChevronDown className="mx-2 h-4 w-4 text-foreground-lighter" strokeWidth={1.5} />
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto min-w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput placeholder="Search..." onKeyDown={handleInputKeyDown} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded border border-control bg-control/25',
                      selectedValues.length === options.length
                        ? 'border-foreground bg-foreground text-background'
                        : '[&_svg]:invisible',
                    )}
                  >
                    <CheckIcon className="h-3 w-3" style={{ strokeWidth: 3 }} />
                  </div>
                  <span>(Select All)</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded border border-control bg-control/25',
                          isSelected
                            ? 'border-foreground bg-foreground text-background'
                            : '[&_svg]:invisible',
                        )}
                      >
                        <CheckIcon className="h-3 w-3" style={{ strokeWidth: 3 }} />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-foreground-lighter" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 cursor-pointer justify-center"
                      >
                        Clear
                      </CommandItem>
                      <Separator orientation="vertical" className="flex h-full min-h-6" />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="max-w-full flex-1 cursor-pointer justify-center"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

MultiSelect.displayName = 'MultiSelect'
