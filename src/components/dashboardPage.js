import React, { Component } from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import Profiles from "../components/profiles";
import ProfileAdd from "../components/ProfileAdd.js";
import Channel from "../components/channel";
import * as types from '../actions';
import { checkCookie, setCookie } from '../utils/cookies';
import LinkButton from './LinkButton';
import MenuTop from './MenuTop';
import ReactHLS from 'react-hls';


import DashboardPageInner from './dashboardPageInner';

class DashboardPage extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      token: checkCookie(),
      reacthls: '',
    };
    this.checkHLS = this.checkHLS.bind(this);
  }



  checkHLS(){
    const video_url = localStorage.getItem("video_url") || '';
    if (video_url && this.videoURL != video_url){
      this.videoURL = video_url;
      this.setState({
        reacthls: video_url,
      });
      alert(video_url);
      window.setTimeout(this.checkHLS(), 500);
    }
    if (!video_url && this.state.reacthls){

      alert(video_url);
      this.setState({
        reacthls: false,
      });
      window.setTimeout(this.checkHLS(), 500);
    }    
  }


  componentWillMount() {
    this.checkVideoTimer = window.setTimeout(this.checkHLS(), 500);
  };


  render() {


    return (
      <div>
        <DashboardPageInner />
        <div className="miniPlayer">
          {this.state.reacthls ? <ReactHLS width="300" height="auto" url={this.state.reacthls} autoplay="true" /> : ''}
        </div>        
      </div>
    );

  }
}

export default withRouter(DashboardPage);