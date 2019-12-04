import React, { Component } from "react";
import LinkButton from './LinkButton';
import { ClipLoader } from 'react-spinners';
import {checkCookie} from '../utils/cookies';
import {withRouter} from 'react-router-dom';

import JustLink from './JustLink';

import "./profiles.css";


class ProfileAdd extends React.Component {
    
    constructor(props){
      super(props);
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
      fetch(process.env.REACT_APP_API_URL+'/v2/users/self/profile?access_token=' + that.state.token, {
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
        localStorage.removeItem('mainFilters');
        localStorage.removeItem('programs');
        localStorage.removeItem('programs_filters');
        localStorage.removeItem('channels');
        window.top.location.reload();
      });    
      
    };


    componentWillMount() {
    };
    render() {
        return (          
          <div className="profiles">
            <h1>Созданиие персонажа</h1>
            <button className="btn btn-info">Создать новый персонаж</button>         
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



export default withRouter(ProfileAdd)