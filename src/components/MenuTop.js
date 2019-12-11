import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import LinkButton from './LinkButton';

import JustLink from './JustLink';
import { checkCookie } from '../utils/cookies';


class MenuTop extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      profile: {},      
      token: checkCookie(),
      profileNull: false,
      selected: {
        channels:'',
        programs:'',
        videos:'',
        devices:'',
      }
    };
    this.params = props.match.params;    
  }


  fetchProfiles() {
    var that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/users/self/profiles?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      that.setState({ 'profile': result[0]});
      localStorage.setItem('profiles', JSON.stringify(result));
      localStorage.setItem('profile', JSON.stringify(result[0]));
    });
  }  


  componentWillMount() {
    const storeProfiles = localStorage.getItem('profiles');
    const storeProfile = localStorage.getItem('profile');
    if (storeProfiles){
      let profiles = JSON.parse(storeProfiles);
      
      if (!storeProfile){
        this.setState({ 'profile': profiles[0]});
        localStorage.setItem('profile', JSON.stringify(profiles[0]));        
      }
      else{
        if (profiles[0]){
          let profile = JSON.parse(storeProfile);
          this.setState({ 'profile': profile});
        }
        else{
          this.setState({ 'profileNull': true});
        }
      }
    }
    else{
      this.fetchProfiles();
    }
  };

  render() {
    this.state.selected = {};
    if (this.props.match.params && this.props.match.params.url){
      this.state.selected[this.props.match.params.url] = 'btn-selected';
    }
    else{
      this.state.selected['main'] = 'btn-selected';
    }

      return (

        <header class="header d-flex justify-content-start justify-content-lg-between align-items-center">
            <ul class="header__nav nav d-block d-lg-flex" id="nav">
              <li class="header__nav-item nav-item">
                <JustLink replaceClass="header__nav-link nav-link active" to="/dashboard/profile/">Главная</JustLink>
              </li>
              <li class="header__nav-item nav-item">
                <JustLink replaceClass="header__nav-link nav-link" to="/dashboard/channels/">Телеканалы</JustLink>
              </li>
              <li class="header__nav-item nav-item">
               <JustLink replaceClass="header__nav-link nav-link" to="/dashboard/programs/">ТВ архив</JustLink>
              </li>
              <li class="header__nav-item nav-item">
                <JustLink replaceClass="header__nav-link nav-link" to="/dashboard/videos/">Кинотеатры</JustLink>
              </li>
              <li class="header__nav-item nav-item">
                <JustLink replaceClass="header__nav-link nav-link" to="/dashboard/devices/">Мои устройства</JustLink>
              </li>
            </ul>
            <a href="#" class="header__user d-flex align-items-center flex-shrink-0">
              <div class="header__user-name flex-grow-1">
                {this.state.profile ? <span>{this.state.profile.name}</span> : ''}
                {this.state.profileNull ? <span>No Name</span> : '' }
              </div>
              <div class="header__user-avatar flex-shrink-0">
                {this.state.profileNull ? <LinkButton classNameReplace="btn btn-avatar" to='/dashboard/profile/'><img className="header__user-img" src="/avatar.png" /></LinkButton> : '' }
                {this.state.profile && !this.state.profileNull ? <LinkButton classNameReplace="btn btn-avatar" to='/dashboard/profile/'><img src={this.state.profile.icon} /></LinkButton> : '' }
              </div>
            </a>
            <div class="header__pull d-block d-lg-none flex-shrink-0" id="pull">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </header>
      );
  }
}

export default withRouter(MenuTop);