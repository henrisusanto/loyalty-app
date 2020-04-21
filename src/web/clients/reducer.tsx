/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useLayoutEffect } from 'react'

/**
 * Taken from https://github.com/kentcdodds/bookshelf/blob/master/src/utils/use-async.js
 * @param dispatch
 */
function useSafeDispatch (dispatch: any): any {
  const mounted = React.useRef(false)
  useLayoutEffect(() => {
    mounted.current = true
    return (): void => {
      mounted.current = false
    }
  }, [])
  /**
   * Only the functions related to the state that changes are going to be re-instantiated.
   * Check this out: https://flaviocopes.com/react-hook-usecallback/
   */
  return React.useCallback(
    (...args: any) => (mounted.current ? dispatch(...args) : undefined),
    [dispatch]
  )
}

function useAsync (): any {
  const [{ status, data, error }, setState] = React.useReducer(
    (s: any, a: any) => ({ ...s, ...a }),
    { status: 'idle', data: null, error: null }
  )

  const safeSetState = useSafeDispatch(setState)

  const run = React.useCallback(
    promise => {
      if (!promise || !promise.then) {
        throw new Error(
          "The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"
        )
      }
      safeSetState({ status: 'pending' })
      return promise.then(
        (data: any) => {
          safeSetState({ data, status: 'resolved' })
          return data
        },
        (error: any) => {
          safeSetState({ status: 'rejected', error })
          return error
        }
      )
    },
    [safeSetState]
  )

  const setData = React.useCallback(data => safeSetState({ data }), [
    safeSetState
  ])
  const setError = React.useCallback(error => safeSetState({ error }), [
    safeSetState
  ])

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run
  }
}

export { useAsync }
