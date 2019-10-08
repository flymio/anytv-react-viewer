import React, { Component } from 'react';
import { Button } from 'reactstrap';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

import {withRouter} from 'react-router-dom';

import Profiles from "../components/profiles";
import { checkCookie } from '../utils/cookies';


import "./dashboardPage.css";

class DashboardPage extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      token: checkCookie(),
    };    
  }


  fetchProfiles() {
    var that = this;
    fetch('https://24h.tv/v2/users/self/profiles?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      that.setState({ 'data': result});
      localStorage.setItem('profiles', JSON.stringify(result));
    });
  }

  componentWillMount() {
    const storeProfiles = localStorage.getItem('profiles');
    if (storeProfiles){
      let profiles = JSON.parse(storeProfiles);
      this.setState({ 'data': profiles});
    }
    else{
      this.fetchProfiles();
    }
  };



  render() {
    return (
      <div className="Dashboard">
        <h1>Выбери профиль, юный падаван!</h1>
        <Profiles data={this.state.data} />
      </div>
    );
  }
}

export default withRouter(DashboardPage);