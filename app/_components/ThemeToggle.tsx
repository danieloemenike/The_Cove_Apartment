"use client"
import { useEffect, useState } from 'react';

export type MenuTheme = 'dark' | 'light';

const THEME_KEY = 'cove-menu-theme';
const NUDGE_KEY = 'cove-light-nudge-dismissed';

/** Runs before paint (inlined in <head>) so a saved light theme never flashes dark. */
export const themeBootScript = `try{if(localStorage.getItem('${THEME_KEY}')==='light')document.documentElement.dataset.menuTheme='light'}catch(e){}`;

function readTheme(): MenuTheme {
  return document.documentElement.dataset.menuTheme === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: MenuTheme) {
  if (theme === 'light') document.documentElement.dataset.menuTheme = 'light';
  else delete document.documentElement.dataset.menuTheme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

function SunIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={1.7} strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={1.7} strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

/**
 * Light/dark switch for the public menu, plus a one-time nudge that suggests
 * light mode to guests reading in a bright room.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<MenuTheme>('dark');
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    const current = readTheme();
    setTheme(current);

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(NUDGE_KEY) === '1';
    } catch {}
    if (current === 'dark' && !dismissed) {
      const timer = window.setTimeout(() => setShowNudge(true), 1500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function dismissNudge() {
    setShowNudge(false);
    try {
      localStorage.setItem(NUDGE_KEY, '1');
    } catch {}
  }

  function choose(next: MenuTheme) {
    applyTheme(next);
    setTheme(next);
    dismissNudge();
  }

  const next: MenuTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <button
        type="button"
        onClick={() => choose(next)}
        aria-label={`Switch to ${next} mode`}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-brass/30 bg-ink-raised px-4 text-sm text-cream transition-colors hover:border-brass/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>

      {showNudge ? (
        <div
          role="status"
          className="cove-rise fixed inset-x-4 bottom-16 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-brass/40 bg-ink-raised/95 p-3 pl-4 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brass text-ink">
            <SunIcon />
          </span>
          <p className="min-w-0 flex-1 text-sm leading-snug text-cream">
            Hard to read in a bright room?
            <span className="block text-mist">Switch the menu to light mode.</span>
          </p>
          <button
            type="button"
            onClick={() => choose('light')}
            className="shrink-0 rounded-full bg-brass px-4 py-2 text-sm font-medium text-ink hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-raised"
          >
            Switch
          </button>
          <button
            type="button"
            onClick={dismissNudge}
            aria-label="Keep dark mode"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-mist hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 stroke-current" strokeWidth={1.8} strokeLinecap="round">
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );
}
