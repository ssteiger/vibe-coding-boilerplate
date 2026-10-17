import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
  cn,
} from '@vibe-coding-boilerplate/ui'
import type * as React from 'react'

export function SettingsSection({
  id,
  title,
  description,
  action,
  children,
}: {
  id?: string
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card id={id} className={id ? 'scroll-mt-20' : undefined}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-5">{children}</CardContent>
    </Card>
  )
}

/** One setting: what it is on the left, its control on the right. */
export function SettingRow({
  id,
  label,
  description,
  children,
}: {
  id?: string
  label: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex flex-col gap-1">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="shrink-0 pt-0.5">{children}</div>
    </div>
  )
}

export interface Choice<T extends string> {
  value: T
  label: string
  hint?: string
  icon?: React.ComponentType<{ className?: string }>
}

/** A handful of options side by side, each with a line saying what it means. */
export function ChoiceGroup<T extends string>({
  name,
  label,
  value,
  choices,
  onChange,
  columns = 3,
}: {
  name: string
  label: string
  value: T
  choices: Choice<T>[]
  onChange: (value: T) => void
  columns?: 2 | 3
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as T)}
        className={cn('grid gap-2', columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}
      >
        {choices.map(({ value: v, label: text, hint, icon: Icon }) => {
          const id = `${name}-${v}`
          return (
            <Label
              key={v}
              htmlFor={id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal transition-colors hover:bg-accent/40',
                value === v && 'border-primary bg-primary/5',
              )}
            >
              <RadioGroupItem id={id} value={v} className="mt-0.5" />
              <span className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {Icon ? <Icon className="size-3.5 text-muted-foreground" /> : null}
                  {text}
                </span>
                {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
              </span>
            </Label>
          )
        })}
      </RadioGroup>
    </fieldset>
  )
}
