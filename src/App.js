import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { logout } from './firebaseHelpers/auth'
import { firebaseAuth } from './config/constants'
import './App.css'

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/farmate/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/farmate/dashboard' />}
    />
  )
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true,
  }
  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-default navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <Link to="/farmate/dashboard" className="navbar-brand">Farmate</Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>
                  {this.state.authed
                    ? <button
                        style={{border: 'none', background: 'transparent'}}
                        onClick={() => {
                          logout()
                        }}
                        className="navbar-brand">Logout</button>
                    : <span>
                        <Link to="/farmate/login" className="navbar-brand">Login</Link>
                        <Link to="/farmate/register" className="navbar-brand">Register</Link>
                      </span>}
                </li>
              </ul>
            </div>
          </nav>
          <div className="container">
            <div className="row">
              
              <Switch>
                <Route path='/farmate' exact component={Login} />
                <PublicRoute authed={this.state.authed} path='/farmate/login' component={Login} />
                <PublicRoute authed={this.state.authed} path='/farmate/register' component={Register} />
                <PrivateRoute authed={this.state.authed} path='/farmate/dashboard' component={Dashboard} />
                <Route render={() => <Redirect to='/farmate/dashboard'/>}/>
              </Switch>
              
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
