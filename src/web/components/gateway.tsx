/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { LoginForm } from './login'
import { RegisterForm } from './register'
import { Admin } from './admin'
import { NotFound } from './notfound'

export const Gateway = (props: any): ReactElement => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render = {(routerProps): ReactElement => <LoginForm {...routerProps} {...props} />} />
        <Route path="/register" render = {(routerProps): ReactElement => <RegisterForm {...routerProps} {...props} />} />
        <Route exact path="/admin" render = {(routerProps): ReactElement => <Admin {...routerProps} {...props} />} />
        <Route path='*' exact={true} component={NotFound} />
      </Switch>
    </Router>
  )
}
