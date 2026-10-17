import * as React from 'react'

/*
 * Client-only: how this browser shows the app. Kept in localStorage, applied
 * to <html> before the first paint by BOOT_SCRIPT so nothing flashes.
 * The theme keeps its own `localStorage.theme` key, which the header toggle
 * also writes.
 */

export type ThemeChoice = 'dark' | 'light' | 'system'
export type TextSize = 'normal' | 'large' | 'larger'
export type MotionChoice = 'system' | 'reduce' | 'full'

export interface Preferences {
  textSize: TextSize
  motion: MotionChoice
}

export const DEFAULT_PREFERENCES: Preferences = {
  textSize: 'normal',
  motion: 'system',
}

const PREFS_KEY = 'app-preferences'
const listeners = new Set<() => void>()
let cache: Preferences | null = null

function read(): Preferences {
  if (cache) return cache
  try {
    const stored = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}') as Partial<Preferences>
    cache = { ...DEFAULT_PREFERENCES, ...stored }
  } catch {
    cache = DEFAULT_PREFERENCES
  }
  return cache
}

function notify() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== PREFS_KEY && e.key !== 'theme') return
    cache = null
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function usePreferences(): Preferences {
  return React.useSyncExternalStore(subscribe, read, () => DEFAULT_PREFERENCES)
}

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
  const next = { ...read(), [key]: value }
  cache = next
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next))
  } catch {
    // Private windows: the choice lasts until the page closes.
  }
  applyToDocument()
  notify()
}

export function resetPreferences() {
  cache = DEFAULT_PREFERENCES
  try {
    localStorage.removeItem(PREFS_KEY)
    localStorage.removeItem('theme')
  } catch {
    // Nothing stored to remove.
  }
  applyToDocument()
  notify()
}

// ---------------------------------------------------------------------------
// Theme

function readTheme(): ThemeChoice {
  try {
    const value = localStorage.getItem('theme')
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

export function resolveDark(theme: ThemeChoice): boolean {
  if (theme === 'light') return false
  if (theme === 'dark') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** Also notices the header's theme toggle, which only flips the class. */
function subscribeTheme(listener: () => void) {
  const unsubscribe = subscribe(listener)
  const observer = new MutationObserver(listener)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => {
    unsubscribe()
    observer.disconnect()
  }
}

export function useTheme(): ThemeChoice {
  return React.useSyncExternalStore(subscribeTheme, readTheme, () => 'system')
}

export function setTheme(theme: ThemeChoice) {
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Private windows: the choice lasts until the page closes.
  }
  applyToDocument()
  notify()
}

// ---------------------------------------------------------------------------
// Applying

export function applyToDocument() {
  const root = document.documentElement
  const prefs = read()
  root.classList.toggle('dark', resolveDark(readTheme()))
  root.dataset.text = prefs.textSize
  root.dataset.motion = prefs.motion
}

/** Keeps "follow the system" in step when the OS switches between light and dark. */
export function usePreferencesSync() {
  React.useEffect(() => {
    applyToDocument()
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (readTheme() === 'system') applyToDocument()
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
}

/** Runs before the first paint: follows the system unless chosen otherwise. */
export const BOOT_SCRIPT = `(function(){var r=document.documentElement;try{var t=localStorage.getItem('theme');var d=t==='light'?false:t==='dark'?true:matchMedia('(prefers-color-scheme: dark)').matches;r.classList.toggle('dark',d);var p=JSON.parse(localStorage.getItem('${PREFS_KEY}')||'{}');r.dataset.text=p.textSize||'normal';r.dataset.motion=p.motion||'system'}catch(e){}})()`
