import { useLayoutEffect, useState } from 'react';

export type ThemeType = 'light' | 'dark';

const isDarkTheme =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaulTheme: ThemeType = isDarkTheme ? 'dark' : 'light';

const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const stored = localStorage.getItem('app-theme');
    if (stored === 'light' || stored === 'dark') return stored;

    return defaulTheme;
  });

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};

export default useTheme;
