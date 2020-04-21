import React from 'react'
import { createContext } from './context'

export const defaultAuth = false

type AuthContextType = {
  auth: boolean;
  setAuth: (value: boolean) => void;
}

export const [useAuth, CtxProvider] = createContext<AuthContextType>()

type Props = { children: React.ReactNode }

export const AuthProvider = ({ children }: Props): JSX.Element => {
  const [auth, setAuth] = React.useState(defaultAuth)
  React.useEffect(() => {
    // We'd get the theme from a web API / local storage in a real app
    // We've hardcoded the theme in our example
    const currentAuth = false
    setAuth(currentAuth)
  }, [])

  return (
    <CtxProvider value={{ auth, setAuth }}>
      {children}
    </CtxProvider>
  )
}
