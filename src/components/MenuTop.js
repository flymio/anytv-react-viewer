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
      }
    };
    this.params = props.match.params;    
  }


  fetchProfiles() {
    var that = this;
    fetch('https://24h.tv/v2/users/self/profiles?access_token=' + that.state.token).then(function (response) {
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
    console.log(storeProfile);
    if (storeProfiles){
      let profiles = JSON.parse(storeProfiles);
      this.setState({ 'profile': profiles[0]});
      localStorage.setItem('profile', JSON.stringify(profiles[0]));
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

      return (
        <div>
          {this.state.profile ? <button class="btn btn-avatar"><img src={this.state.profile.icon} /><br/><span>{this.state.profile.name}</span></button> : '' }
          <LinkButton className={this.state.selected.channels} to='/dashboard/channels/'>Телеканалы</LinkButton> &nbsp;
          <LinkButton className={this.state.selected.programs} to='/dashboard/programs/'>ТВ архив</LinkButton> &nbsp;
          <LinkButton className={this.state.selected.videos} to='/dashboard/videos/'>Кинотеатры</LinkButton>
        </div>
      );
  }
}

export default withRouter(MenuTop);