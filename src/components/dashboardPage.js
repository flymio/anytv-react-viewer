import React, { Component } from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import Profiles from "../components/profiles";
import ProfileAdd from "../components/ProfileAdd.js";
import Channel from "../components/channel";
import * as types from '../actions';
import { checkCookie, setCookie } from '../utils/cookies';
import LinkButton from './LinkButton';
import MenuTop from './MenuTop';

import Channels from './Channels';
import Programs from './Programs';
import Videos from './Videos';
import Persons from './Persons';


import RemoveOneDevice from './RemoveOneDevice';
import ShowMain from './ShowMain';

import "./dashboardPage.css";

class DashboardPage extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      token: checkCookie(),
      deviceID: localStorage.getItem('deviceID') || '',
      deviceIDToken: checkCookie('deviceIDToken') || '',
      need_to_fetch: true,      
      profileID: '',
      schedule: [],
      is_loading: true,
      need_remove_device: false,
    };
    this.registerDevice = this.registerDevice.bind(this); 
    this.authByDeviceId = this.authByDeviceId.bind(this); 

    this.fetchProfiles = this.fetchProfiles.bind(this);
  }





  authByDeviceId() {
    var that = this;
    var device = JSON.parse(that.state.deviceID);
    var data = {
      device_id: device.id,
    };
    fetch(process.env.REACT_APP_API_URL+'/v2/auth/device', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        "Content-Type": "application/json",
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result);
      setCookie("deviceIDToken", result.access_token, 1);
      setCookie("token", result.access_token, 24);
      that.setState({"token": result.access_token, "deviceIDToken": result.access_token});
    });    
  };

  registerDevice(data) {
    var that = this;
    var need_register = localStorage.getItem('not_register');
    if (need_register == 'true'){
      return;
    }
    fetch(process.env.REACT_APP_API_URL+'/v2/users/self/devices?access_token=' + that.state.token, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        "Content-Type": "application/json",
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (result['error'] && result['status_code'] == '400'){
        that.setState({ 'need_remove_device': true});
        localStorage.setItem('not_register', true);
      }
      else{
        localStorage.setItem('deviceID', JSON.stringify(result));        
        localStorage.setItem('not_register', false);
        that.setState({ 'need_remove_device': false});
      }
    });    
  }


  fetchProfiles() {
    var that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/users/self/profiles?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      that.setState({ 'profiles': result, need_to_fetch: false});
      localStorage.setItem('profiles', JSON.stringify(result));
    });
  }  


  componentWillMount() {
    const storeProfiles = localStorage.getItem('profiles');
    const storeProfile = localStorage.getItem('profile');

    if (this.state.deviceID && !this.state.deviceIDToken){
      this.authByDeviceId();
    }

    if (!storeProfiles){
      this.fetchProfiles();
    }

    if (!this.state.profileID){
      if (storeProfile){
        let profile = JSON.parse(storeProfile);
        this.setState({profileID: profile['id']});
      }
    }
  };



  render() {
    this.params = this.props.match.params;

    this.deviceID = localStorage.getItem('deviceID') || '';





    if (!this.deviceID && !this.params.url){
      localStorage.setItem('not_register', false);
      return (
        <div className="Dashboard">
          <h1>Регистрация устройства...</h1>
          <Redirect to="/dashboard/deviceRegister" />
        </div>
      );      
    }

    if (this.params.url && this.params.url == 'deviceRegister' && this.deviceID){
      if (this.state.profileID){
        return <Redirect to="/dashboard" />        
      }
      else{
        return <div>
                <MenuTop />
                {!this.state.need_to_fetch ? <Profiles /> : ''}
              </div>
      }
    }

    if (this.params.url && this.params.url == 'deviceRegister' && !this.deviceID){
      this.registerDevice(types.device_info);      
      localStorage.setItem('not_register', true);
      return (
        <div className="Dashboard">
          {!this.state.need_remove_device ? <h1>Регистрация устройства...</h1> : <RemoveOneDevice/>}
        </div>
      );      
    }
    if (this.params.url && this.params.url == 'devices'){
      return (
        <div className="Dashboard">
          <MenuTop />
          <RemoveOneDevice/>
        </div>
      );      
    }


    if ((!this.params.url || this.params.url == 'main')  && this.deviceID){

      return (
        <div className="Dashboard">
          <MenuTop />
          <ShowMain/>
        </div>
      );      

    }
    if (this.params.url && this.params.url == 'channels'){
      return (
        <div className="Dashboard">
          {!this.state.need_remove_device ? <div><MenuTop /><Channels/></div> : <RemoveOneDevice/>}
        </div>
      );      
    }

    if (this.params.url && this.params.url == 'programs'){
      return (
        <div className="Dashboard">
          {!this.state.need_remove_device ? <div><MenuTop /><Programs /></div> : <RemoveOneDevice/>}
        </div>
      );      
    }


    if (this.params.url && this.params.url == 'profile' && !this.params.url_id){
      return (
        <div className="Dashboard">
        {!this.state.need_remove_device ? <div><MenuTop /><Profiles/></div> : <RemoveOneDevice/>}          
        </div>
      );      
    }

    if (this.params.url && this.params.url == 'persons' && !this.params.url_id){
      return (
        <div className="Dashboard">
        {!this.state.need_remove_device ? <div><MenuTop /><Persons/></div> : <RemoveOneDevice/>}          
        </div>
      );      
    }


    if (this.params.url && this.params.url == 'profile' && this.params.url_id && this.params.url_id == 'create'){
      return (
        <div className="Dashboard">
        {!this.state.need_remove_device ? <div><MenuTop /><ProfileAdd/></div> : <RemoveOneDevice/>}          
        </div>
      );      
    }


    if (this.params.url && this.params.url == 'videos'){
      return (
        <div className="Dashboard">
          {!this.state.need_remove_device ? <div><MenuTop /><Videos /></div> : <RemoveOneDevice/>}
        </div>
      );      
    }

    return (
      <div className="Dashboard">
        {!this.state.need_remove_device ? <MenuTop /> : <RemoveOneDevice/>}
      </div>
    );
  }
}

export default withRouter(DashboardPage);