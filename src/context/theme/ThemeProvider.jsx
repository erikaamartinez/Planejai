import { useEffect, useState } from 'react'

import { ThemeContext } from './ThemeContext'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
  const localStorageTheme = localStorage.getItem('theme')

  if (localStorageTheme) {
    return localStorageTheme
  }

  const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches

  return systemPrefersDark ? 'dark' : 'light'
})

  useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
