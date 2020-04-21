/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { Gateway } from './components/gateway'
import {
  getUser,
  login as userLogin,
  register as userRegister,
  logout as userLogout
} from './clients/auth.client'
import { useAsync } from './clients/reducer'

/**
 * Taken and modified from https://github.com/kentcdodds/bookshelf/blob/exercises/06-cache-management/src/app.js
 */
export const App = (): JSX.Element => {
  const {
    data: user,
    data,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
    setError
  } = useAsync()

  const login = (payload: any): void => userLogin(payload)
    .then((user: any) => setData(user))
    .catch((err: Error) => {
      setError(err)
    })

  const register = (payload: any): void => userRegister(payload)
    .then(() => setData('register_success'))
    .catch((err: Error) => {
      setError(err)
    })

  const logout = (): void => {
    userLogout()
    run(Promise.resolve(null))
    setData(null)
  }

  const props = { login, register, logout, user, error, setError, data, setData }

  useEffect(() => {
    run(getUser())
  }, [run])

  if (isError) {
    return <>
      <span>Uh oh... There&#39;s a problem. Try refreshing the app.</span> <button onClick={logout}>Refresh</button>
      <pre>{error.message}</pre>
    </>
  }
  if (isLoading || isIdle) return <>Loading...</>
  if (isSuccess) return <Gateway {...props} />
  else return <>Loading...</>
}
