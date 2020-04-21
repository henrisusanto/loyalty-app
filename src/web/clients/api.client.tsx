/* eslint-disable @typescript-eslint/no-explicit-any */
// import {queryCache} from 'react-query'
import { config as webConfig } from '../web.config'
const localStorageKey = '__bookshelf_token__'

function logout (): void {
  // queryCache.clear()
  window.localStorage.removeItem(localStorageKey)
}

function client (endpoint: string, bodyOrConfig: any = {}): any {
  const { body = undefined, ...customConfig } = bodyOrConfig
  const token = window.localStorage.getItem(localStorageKey)
  const headers: any = { 'content-type': 'application/json' }
  const { customHeaders } = customConfig as any
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const config: any = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customHeaders
    }
  }
  if (body) {
    config.body = JSON.stringify(body)
  }

  return window
    .fetch(`${webConfig.prefix}${endpoint}`, config)
    .then(async r => {
      if (r.status === 401) {
        logout()
        // refresh the page for them
        window.location.assign(window.location as unknown as string)
        return
      }
      const data = await r.json()
      if (r.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
    .catch(err => {
      throw err
    })
}

export { client, localStorageKey, logout }
