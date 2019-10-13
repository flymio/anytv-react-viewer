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
import Channel from "../components/channel";
import { checkCookie } from '../utils/cookies';
import LinkButton from './LinkButton';


import "./dashboardPage.css";

class DashboardPage extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      token: checkCookie(),
      schedule: [],
      is_loading: true,
    };
    this.params = props.match.params;    
  }


  fetchSchedule(channel_id){
    var that = this;
    fetch('https://24h.tv/v2/channels/'+channel_id+'/schedule?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      that.setState({ 'schedule': result});
      localStorage.setItem('schedule_'+channel_id, JSON.stringify(result));
    });
  };

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
    if (this.params.channel_id){
      const scheduleList = localStorage.getItem('schedule'+this.params.channel_id);
      if (scheduleList){
        let schedule =  JSON.parse(scheduleList);
        this.setState({ 'schedule': schedule});
      }
      else{
        this.fetchSchedule(this.params.channel_id);
      }
    }
  };



  render() {

    

    if (this.params.channel_id){
      return (
        <div className="Dashboard">
          <LinkButton to='/dashboard/channels/'>Телеканалы</LinkButton><Channel data={this.state.schedule} />
        </div>
      );
    }

    return (
      <div className="Dashboard">
        <h1>Выбери профиль, юный падаван!</h1>
        <Profiles data={this.state.data} />
      </div>
    );
  }
}

export default withRouter(DashboardPage);