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


    this.showRubrics = this.showRubrics.bind(this);
    this.showChannels = this.showChannels.bind(this);
  }



  saveCurrentChannel = function(item){
    localStorage.setItem('channel', JSON.stringify(item));
  };

  showRubrics = function(data){
    if (isEmpty(data)){
      return '';
    }
    data = data.slice(0,10);
    return data.map((item, key) =>
      <div className="Rubrics">
        <h1>{item.name}</h1>
        <div className="Channels">
          {this.showChannels(item.channels)}
        </div>
      </div>
    );
  };


  showChannels = function(data){
    var that = this;
    if (isEmpty(data)){
        return ''
    }
    data = data.slice(0,10);
    return data.map((item, key) =>
      <div className="Channel">
          <LinkButton
            onClick={(event) => {
              that.saveCurrentChannel(item)
            }}
            to={linkToChannel(item)}            
          >
          <div className="Channel_img"><img src={item.images[0].src||item.icon} /></div>
          {item.name}
          </LinkButton>
        </div>
    );    
  }



  fetchChannelsCategories() {
    var that = this;
    fetch('https://24h.tv/v2/channels/categories?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result);
      that.setState({ loading: false});
      that.setState({ data: result});
      localStorage.setItem('channels_categories', JSON.stringify(result));
    });
  }

  componentDidMount() {
    const storeUser = localStorage.getItem('user');
    const chanelsList = localStorage.getItem('channels_categories');
    if (storeUser){
      let user = JSON.parse(storeUser);
      this.setState({ user: user });  


      if (chanelsList){
        let channels = JSON.parse(chanelsList);
        this.setState({ data: channels });  
        this.setState({ loading: false});
      }
      else{
        this.fetchChannelsCategories();
      }


    }
  }

  render() {

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };


    return (
      <div className="Profile">

        <h1><img src={this.state.user.icon} /> Привет,  {this.state.user.name}</h1>
        
        <LinkButton to='/dashboard'>Телеканалы</LinkButton>
        &nbsp;
        <LinkButton to='/dashboard'>ТВ архив</LinkButton>
        &nbsp;
        <LinkButton to='/dashboard'>Кинотеатры</LinkButton>
        <br/><br/><br/>
        {this.state.loading ? 'А вот тут покажутся твои каналы каналы :-)' : ''}
        {!this.state.loading ? this.showRubrics(this.state.data) : ''}

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


const linkToChannel = (props) => {
  return "/dashboard/channel/" + props.id + "/";
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
