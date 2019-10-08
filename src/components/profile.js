import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import {withRouter} from 'react-router-dom';
import LinkButton from './LinkButton';

import "./profile.css";


class Profile extends Component {


  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      data: {},
      token: checkCookie(),
      user: {},
      loading: true,
    };    


    this.showChannels = this.showChannels.bind(this);
  }


  showChannels = function(data){
    if (isEmpty(data)){
      return '';
    }
    data = data.slice(0,10);
    return data.map((item, key) =>
      <div className="Channel">
          <LinkButton             
            to={linkToChannel(item)}            
          >
          <img src={item.icon} /><br/>
          {item.name}
          </LinkButton>
        </div>
    );
  };


  fetchChannels() {
    var that = this;
    fetch('https://24h.tv/v2/channels?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result);
      that.setState({ loading: false});
      that.setState({ data: result});
      localStorage.setItem('channels', JSON.stringify(result));
    });
  }

  componentDidMount() {
    const storeUser = localStorage.getItem('user');
    const chanelsList = localStorage.getItem('channels');
    if (storeUser){
      let user = JSON.parse(storeUser);
      this.setState({ user: user });  

      if (chanelsList){
        let channels = JSON.parse(chanelsList);
        this.setState({ data: channels });  
        this.setState({ loading: false});
      }
      else{
        this.fetchChannels();
      }
    }
  }

  render() {

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };


    return (
      <div className="Profile">

        <h1><img src={this.state.user.icon} /> Привет,  {this.state.user.name}</h1>
        
        <LinkButton to='/dashboard'>Назад к выбору профилям</LinkButton>
        <br/><br/><br/>
        {this.state.loading ? 'А вот тут покажутся твои каналы каналы :-)' : ''}
        {!this.state.loading ? this.showChannels(this.state.data) : ''}

        <div style={style}>
          <ClipLoader
            sizeUnit={"px"}
            size={50}
            color={'#17a2b8'}
            loading={this.state.loading}
          />
          </div>

      </div>
    );
  }
}


const linkToChannel = (props) =>{
  return "/channel/" + props.id;
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

export default withRouter(Profile);
