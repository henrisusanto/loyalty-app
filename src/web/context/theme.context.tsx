import React from 'react'
import { createContext } from './context'

type ThemeContextType = {
  theme: string;
  setTheme: (value: string) => void;
}
export const [useTheme, CtxProvider] = createContext<ThemeContextType>()

type Props = {
  children: React.ReactNode;
}
export const ThemeProvider = ({ children }: Props): JSX.Element => {
  const [theme, setTheme] = React.useState('white')

  React.useEffect(() => {
    // We'd get the theme from a web API / local storage in a real app
    // We've hardcoded the theme in our example
    const currentTheme = 'lightblue'
    setTheme(currentTheme)
  }, [])

  return <CtxProvider value={{ theme, setTheme }}>{children}</CtxProvider>
}
