import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import {withRouter} from 'react-router-dom';
import JustLink from './JustLink';
import "./profile.css";

import ReactHLS from 'react-hls';


class Channel extends Component {


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

    this.showCover = this.showCover.bind(this);    
  }


  showCover = function(){
    return <img src={this.state.video_cover} />;
  };

  showSchedule = function(data){
    let that = this;
    if (isEmpty(data)){
        return '';
    }
    var hour = new Date().getHours();
    var hour_begin = 0;
    for(var i=0; i< data.length; i++){
      var t = data[i].time.split(":")[0];
      if (t >= hour && !hour_begin){
        hour_begin = i;
      }
    }
    return data.map(function(item,key){
      if (key >= hour_begin -3){
        if (key == hour_begin){
          if (!that.state.video){
            that.setState({video: true});
            that.setState({video_cover: item.program.img[1].src || item.program.img[0].src});
          }
          return <li class="list-group-item active"><small>{item.time}</small>, {item.program.title}</li>    
        }
        else{
          return <li class="list-group-item"><JustLink to='/dashboard/channels/'><small>{item.time}</small>, {item.program.title}</JustLink></li>    
        }
      }
      
    });    
  }



  fetchCurrentStream(channel_id) {
    var that = this;
    fetch('https://24h.tv/v2/channels/'+ channel_id +'/stream?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result);
      that.setState({ hasStream: true});
      that.setState({ streamUrl: result.hls});      
    });
  }

  componentDidMount() {
    const scheduleList = localStorage.getItem('schedule_'+this.params.channel_id);
    if (scheduleList){
      let schedule =  JSON.parse(scheduleList);
      this.setState({schedule: schedule});  
      this.setState({loading: false});
    }
    const channelInfo = localStorage.getItem('channel');
    if (channelInfo){
      let channel =  JSON.parse(channelInfo);
      this.setState({channel: channel});  
      this.setState({channelName: channel.name});
      this.fetchCurrentStream(this.params.channel_id);
    }



  }

  render() {

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    return (
      <div>
        <h1>{this.state.channelName}</h1>
        <div class="currentVideo">
        {this.state.video ? this.showCover() : 'no video'}
        {this.state.hasStream ? <ReactHLS url={this.state.streamUrl} autoplay="true" /> : ''}
        </div>
        <ul class="list-group">
        {this.showSchedule(this.state.schedule)}
        </ul>
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

export default withRouter(Channel);
