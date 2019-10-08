import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from './privateRoute';

import LoginPage from '../components/loginPage';
import RegisterPage from '../components/registerPage';
import DashboardPage from '../components/dashboardPage';
import Profile from '../components/profile';


export default () =>
  <Switch>
    <Route path='/' exact={true} component={LoginPage} />
    <Route path='/login' component={LoginPage} />
    <Route path='/register' component={RegisterPage} />
    <PrivateRoute path="/profile/:id" exact component={Profile}  />
    <PrivateRoute path='/dashboard' component={DashboardPage} />
  </Switch>;