/* eslint-disable @typescript-eslint/no-explicit-any */
import { client, localStorageKey } from './api.client'

function getToken (): any {
  return window.localStorage.getItem(localStorageKey)
}

function handleUserResponse (payload: any): any {
  if (!payload) throw new Error('Payload is empty')
  const { data } = payload
  window.localStorage.setItem(localStorageKey, data.token)
  return data
}

export function getUser (): any {
  const token = getToken()
  if (!token) {
    return Promise.resolve(null)
  }
  return client('/user/me')
    .then(handleUserResponse)
    .catch((error: Error) => {
      throw error
    })
}

export const login = ({ username, password }): any => {
  return client('/user/login', { body: { username, password } })
    .then(handleUserResponse)
    .catch((error: Error) => {
      throw error
    })
}

export const register = ({ username, email, password }): any => {
  return client('/user/register', { body: { username, email, password } })
    .catch((error: Error) => {
      throw error
    })
}

export const logout = (): void => {
  window.localStorage.removeItem(localStorageKey)
}
