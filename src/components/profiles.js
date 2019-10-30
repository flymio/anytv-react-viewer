import React, { Component } from "react";
import LinkButton from './LinkButton';
import { ClipLoader } from 'react-spinners';
import {checkCookie} from '../utils/cookies';
import {withRouter} from 'react-router-dom';

import "./profiles.css";


class Profiles extends React.Component {
    
    constructor(props){
      super(props);
      this.getProfiles = this.getProfiles.bind(this);
      this.saveCurrentProfile = this.saveCurrentProfile.bind(this);

      this.state = {
        user: {},
        token: checkCookie(),
        profiles: '',
        profile: '',
      };    

    };
    saveCurrentProfile = function(item){
      var that = this;
      let data = {
        id: item.id,
      };

      //   localStorage.setItem('profile', JSON.stringify(item));
      //   localStorage.removeItem('videos');
      //   localStorage.removeItem('videos_filters');
      //   localStorage.removeItem('programs');
      //   localStorage.removeItem('programs_filters');
      //   localStorage.removeItem('channels');
      //   //window.top.location.reload();

      // console.log(data);
      // return;
      fetch('https://24h.tv/v2/users/self/profile?access_token=' + that.state.token, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          "Content-Type": "application/json",
        }
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        localStorage.setItem('profile', JSON.stringify(item));
        localStorage.removeItem('videos');
        localStorage.removeItem('videos_filters');
        localStorage.removeItem('programs');
        localStorage.removeItem('programs_filters');
        localStorage.removeItem('channels');
        window.top.location.reload();
      });    
      
    };

    getProfiles = function(){
      let that = this;
      let profiles = this.state.profiles;
      return profiles.map((item, key) =>
        <div className={isActiveProfile(item, that)}>
          <LinkButton classNameReplace="btn"
            onClick={(event) => {
              that.saveCurrentProfile(item)
            }} 
          >
          <img src={item.icon} /><br/>
          {item.name}
          </LinkButton>
        </div>
      );
    };



    componentWillMount() {
      const storeProfiles = localStorage.getItem('profiles');
      const storeProfile = localStorage.getItem('profile');
      if (storeProfiles){
        let profiles = JSON.parse(storeProfiles);
        let profile = JSON.parse(storeProfile);
        this.setState({ 'profiles': profiles});
        this.setState({ 'profile': profile});
      }
    };
    render() {
        return (          
          <div className="profiles">
            <h1>Выбери персонажа</h1>
            {this.getProfiles()}          
          </div>
        );
    }
}


const isActiveProfile = (item, that) => {
  if (that.state.profile && that.state.profile.id == item.id){
    return "profile active";
  }
  return 'profile';
}

const linkToProfile = (props) =>{
  return "/profile/" + props.id;
}

const background = (props) =>{
  return "url('"+props.background+"')"
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}



export default withRouter(Profiles)