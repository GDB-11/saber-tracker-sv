// src/lib/stores/theme.svelte.ts
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
  // Initialize with system preference or saved preference
  const getInitialTheme = (): Theme => {
    if (!browser) return 'light';

    // Check for saved preference first
    const saved = localStorage.getItem('theme') as Theme;
    if (saved && (saved === 'light' || saved === 'dark')) {
      return saved;
    }

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  let theme = $state<Theme>(getInitialTheme());

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (!browser) return;

    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save preference
    localStorage.setItem('theme', newTheme);
  };

  // Apply initial theme immediately
  if (browser) {
    applyTheme(theme);
  }

  const toggle = () => {
    theme = theme === 'light' ? 'dark' : 'light';
    applyTheme(theme);
  };

  const setTheme = (newTheme: Theme) => {
    theme = newTheme;
    applyTheme(theme);
  };

  // Initialize system theme listener (to be called from a component)
  const initializeSystemThemeListener = () => {
    if (!browser) return () => { };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        theme = e.matches ? 'dark' : 'light';
        applyTheme(theme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  };

  return {
    get current() {
      return theme;
    },
    get isDark() {
      return theme === 'dark';
    },
    get isLight() {
      return theme === 'light';
    },
    toggle,
    setTheme,
    setLight: () => setTheme('light'),
    setDark: () => setTheme('dark'),
    initializeSystemThemeListener
  };
}

export const themeStore = createThemeStore();