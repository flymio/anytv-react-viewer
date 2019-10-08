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
      };    

    };


    saveCurrentProfile = function(item){
      localStorage.setItem('user', JSON.stringify(item));
    };

    getProfiles = function(){
      let that = this;
      if (isEmpty(this.props.data)){
        return <ClipLoader
          sizeUnit={"px"}
          size={50}
          color={'#17a2b8'}
        />;
      }
      return this.props.data.map((item, key) =>
        <div className={isActiveProfile(item, that)}>
          <LinkButton 
            onClick={(event) => {
              that.saveCurrentProfile(item)
            }} 
            to={linkToProfile(item)}            
          >
          <img src={item.icon} /><br/>
          {item.name}
          </LinkButton>
        </div>
      );
    };


    componentDidMount() {
      const user = localStorage.getItem('user');
      if (user){
        this.setState({ user: JSON.parse(user) });  
      }
    }

    render() {
        return (          
          <div className="profiles">
            {this.getProfiles()}          
          </div>
        );
    }
}


const isActiveProfile = (item, that) => {
  if (that.state.user && that.state.user.id == item.id){
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