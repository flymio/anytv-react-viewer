import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import {withRouter} from 'react-router-dom';
import JustLink from './JustLink';
import "./profile.css";

import ReactHLS from 'react-hls';


class Videos extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      token: checkCookie(),
      user: {},
      loading: true,
      schedule: [],
      channel: {},
      channelName: '',
      video: false,
    };    
    this.params = props.match.params;
  }

  render() {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    return (
      <div>
        <h1>Videos</h1>
        <em>filters</em><br/>
        <em>categories</em><br/>
      </div>
    );
  }
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

export default withRouter(Videos);
