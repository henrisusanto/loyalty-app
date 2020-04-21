/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { Error } from './error'

export const LoginForm = (props: any): JSX.Element => {
  const { login, error, setError, history, setData } = props
  const user = props.user
  let errorMessage = ''
  if (error) errorMessage = error.message

  useEffect(() => {
    setError(null)
    if (user === 'register_success') {
      setData(null)
      history.push('/')
    }
    if (user) history.push('/admin')
  }, [setError, history, user, setData])

  const loginHandler = (event: any): void => {
    event.preventDefault()
    const { username, password } = event.target.elements
    login({
      username: username.value,
      password: password.value
    })
  }

  const registerHandler = (): void => {
    history.push('/register')
  }

  return (
    <div className='flex h-screen bg-gray-300'>
      <div className='w-full m-auto max-w-xs'>
        <form onSubmit={loginHandler} className='bg-white shadow-md rounded px-8 pt-8 pb-8 mt-10 mb-2'>
          <div className='mb-4'>
            <input
              type='text'
              name='username'
              placeholder='username'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='mb-4'>
            <input
              type='password'
              name='password'
              placeholder='password'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className="flex items-center justify-between">
            <input
              type='submit'
              className='primary-btn'
              value='Sign in'
            />
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
        <Error message={errorMessage} />
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-center justify-between'>
          <span>New to site?</span> <button onClick={registerHandler} className='primary-btn'>Create an account</button>
        </div>
      </div>
    </div>
  )
}
