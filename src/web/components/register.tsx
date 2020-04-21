/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { Error } from './error'

export const RegisterForm = (props: any): JSX.Element => {
  const { data, history, register, error, setError } = props
  let errorMessage = ''
  if (error) errorMessage = error.message

  useEffect(() => {
    setError(null)
  }, [setError])

  const submitHandler = (event: any): void => {
    event.preventDefault()
    const { username, password, email } = event.target.elements
    register({
      username: username.value,
      email: email.value,
      password: password.value
    })
  }

  const successHandler = (): void => history.push('/')

  if (data === 'register_success') return <>Register success <button className='primary-btn' onClick={successHandler}>Login</button></>

  return (
    <div className='flex h-screen bg-gray-300'>
      <div className='w-full m-auto max-w-xs'>
        <form onSubmit={submitHandler} className='bg-white shadow-md rounded px-8 pt-8 pb-8 mt-10 mb-2'>
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
              type='text'
              name='email'
              placeholder='email'
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
              value='Sign up'
            />
          </div>
        </form>
        <Error message={errorMessage} />
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-center justify-between'>
          <span>Have an account?</span> <button onClick={successHandler} className='primary-btn'>Sign in</button>
        </div>
      </div>
    </div>
  )
}
