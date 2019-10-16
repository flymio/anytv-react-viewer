import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import Profiles from "../components/profiles";
import Channel from "../components/channel";
import { checkCookie } from '../utils/cookies';
import LinkButton from './LinkButton';
import MenuTop from './MenuTop';

import Channels from './Channels';
import Programs from './Programs';
import Videos from './Videos';


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
  }



  componentWillMount() {
    

  };



  render() {
    this.params = this.props.match.params;
    if (this.params.url && this.params.url == 'channels'){
      return (
        <div className="Dashboard">
          <MenuTop />
          <Channels/>
        </div>
      );      
    }

    if (this.params.url && this.params.url == 'programs'){
      return (
        <div className="Dashboard">
          <MenuTop />
          <Programs />
        </div>
      );      
    }


    if (this.params.url && this.params.url == 'videos'){
      return (
        <div className="Dashboard">
          <MenuTop />
          <Videos />
        </div>
      );      
    }

    return (
      <div className="Dashboard">
        <MenuTop />
      </div>
    );
  }
}

export default withRouter(DashboardPage);