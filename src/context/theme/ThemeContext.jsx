import { createContext } from 'react'

/**
 * @typedef {('light' | 'dark')} Theme
 */

/**
 * @typedef {Object} ThemeContextValue
 * @property {Theme} theme
 * @property {() => void} toggleTheme
 */

export const ThemeContext = createContext(undefined)
