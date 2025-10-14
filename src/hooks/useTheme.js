import { useLayoutEffect, useState } from 'react'

const isDarkTheme =
  window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const defaulTheme = isDarkTheme ? 'dark' : 'light'

const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || defaulTheme)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('app-theme', theme)
  }, [theme])

  return { theme, setTheme }
}

export default useTheme
