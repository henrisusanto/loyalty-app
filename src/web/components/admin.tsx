/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'

export const Admin = (props: any): JSX.Element => {
  const { logout, data, history } = props
  const logoutHandler = (): void => {
    logout()
  }

  useEffect(() => {
    if (!data) history.push('/')
  }, [data, history])

  if (!data) return <>Loading...</>

  const { user } = data
  return (
    <>
      <button onClick={logoutHandler} className='primary-btn'>Logout</button>
      <span> Hello, {user.username}!</span>
    </>
  )
}

// import React from 'react'
// import React, { ChangeEvent } from 'react'
// import { useTheme } from '../context/theme.context'

// export const Admin = (props: any): JSX.Element => {
// const { logout } = props
// const { theme, setTheme } = useTheme()
// return (
// <>
// <button onClick={logout}>Logout</button>
// <span> Hello!</span>
// {/* <div style={{ backgroundColor: theme }}>
// <select value={theme} onChange={(e: ChangeEvent<HTMLSelectElement>): void => setTheme(e.currentTarget.value)}>
// <option value="white">White</option>
// <option value="lightblue">Blue</option>
// <option value="lightgreen">Green</option>
// </select>
// <span>Hello!</span>
// </div> */}
// </>
// )
// }
