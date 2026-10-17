import { createFileRoute } from '@tanstack/react-router'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import * as React from 'react'

import {
  type MotionChoice,
  type TextSize,
  type ThemeChoice,
  setPreference,
  setTheme,
  usePreferences,
  useTheme,
} from '~/lib/preferences'
import { type Choice, ChoiceGroup, SettingsSection } from './-components/SettingsSection'

const THEMES: Choice<ThemeChoice>[] = [
  { value: 'system', label: 'Follow the system', hint: 'Switches with your OS', icon: MonitorIcon },
  { value: 'light', label: 'Light', hint: 'For bright rooms', icon: SunIcon },
  { value: 'dark', label: 'Dark', hint: 'For dim rooms', icon: MoonIcon },
]

const TEXT_SIZES: Choice<TextSize>[] = [
  { value: 'normal', label: 'Normal', hint: 'The standard size' },
  { value: 'large', label: 'Large', hint: 'Everything an eighth bigger' },
  { value: 'larger', label: 'Larger', hint: 'Everything a quarter bigger' },
]

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function useSystemReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  )
}

function GeneralSettingsPage() {
  const theme = useTheme()
  const prefs = usePreferences()
  const systemReduced = useSystemReducedMotion()
  const motionChoices: Choice<MotionChoice>[] = [
    {
      value: 'system',
      label: 'Follow the system',
      hint: systemReduced ? 'Your system asks for less motion' : 'Your system allows motion',
    },
    { value: 'reduce', label: 'Keep still', hint: 'No animations' },
    { value: 'full', label: 'Full motion', hint: 'Animate even if the system asks not to' },
  ]

  return (
    <>
      <SettingsSection title="Look" description="Applies right away, on every page.">
        <ChoiceGroup
          name="theme"
          label="Theme"
          value={theme}
          choices={THEMES}
          onChange={setTheme}
        />
        <ChoiceGroup
          name="text-size"
          label="Text size"
          value={prefs.textSize}
          choices={TEXT_SIZES}
          onChange={(v) => setPreference('textSize', v)}
        />
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="text-xs text-muted-foreground">Preview</div>
          <p className="mt-2 font-medium">Your changes were saved.</p>
          <p className="text-sm text-muted-foreground">Just now · Settings</p>
        </div>
      </SettingsSection>

      <SettingsSection title="Motion" description="For comfort, or for a calmer screen.">
        <ChoiceGroup
          name="motion"
          label="Animations"
          value={prefs.motion}
          choices={motionChoices}
          onChange={(v) => setPreference('motion', v)}
        />
      </SettingsSection>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/_app/settings/')({
  component: GeneralSettingsPage,
})
