import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import LinkButton from './LinkButton';
import { checkCookie } from '../utils/cookies';


class MenuTop extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      profile: {},      
      token: checkCookie(),
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
        let profile = JSON.parse(storeProfile);
        this.setState({ 'profile': profile});
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
        <div>
          {this.state.profile ? <LinkButton classNameReplace="btn btn-avatar" to='/dashboard/profile/'><img src={this.state.profile.icon} /><br/><span>{this.state.profile.name}</span></LinkButton> : '' }
          <LinkButton className={this.state.selected.main} to='/dashboard/main/'>Главная</LinkButton> &nbsp;
          <LinkButton className={this.state.selected.channels} to='/dashboard/channels/'>Телеканалы</LinkButton> &nbsp;
          <LinkButton className={this.state.selected.programs} to='/dashboard/programs/'>ТВ архив</LinkButton> &nbsp;
          <LinkButton className={this.state.selected.videos} to='/dashboard/videos/'>Кинотеатры</LinkButton> &nbsp;
          <LinkButton className={this.state.selected.devices} to='/dashboard/devices/'>Мои устройства</LinkButton>
        </div>
      );
  }
}

export default withRouter(MenuTop);