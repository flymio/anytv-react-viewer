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
    this.changeVideo = this.changeVideo.bind(this);    
  }


  changeVideo = function(item, obj){
    if (item.disabled){
      return;
    }
    for(var i=0;i<this.state.schedule.length;i++){
      if (this.state.schedule[i].timestamp == item.timestamp){
        this.state.schedule[i].active=1;
      }
      if (this.state.schedule[i].timestamp != item.timestamp && this.state.schedule[i].active){
        console.log(1444);
        this.state.schedule[i].active=0;
      }
    }
    this.fetchCurrentStream(this.params.channel_id, item.timestamp);
  };

  showCover = function(){
    return <img src={this.state.video_cover} />;
  };

  showSchedule = function(data){
    let that = this;
    if (isEmpty(data)){
        return '';
    }
    var hour = new Date().getHours();
    var seconds = (new Date().getTime()+"").substr(0,10);
    var hour_begin = 0;
    var seconds_begin = 0;
    for(var i=0; i< data.length; i++){
      var t = data[i].time.split(":")[0];
      var s = data[i].timestamp;
      if (seconds <= s + data[i].duration && seconds >= data[i].timestamp && !hour_begin){
        hour_begin = i;
        seconds_begin = data[i].timestamp;
      }
    }
    data.map(function(item,key){
    });
    return data.map(function(item,key){
      if (key >= hour_begin - 10){
        if (item.timestamp == seconds_begin){
          if (!that.state.video){
            that.setState({video: true});
            that.setState({video_cover: item.program.img[1].src || item.program.img[0].src});
            item.active = 1;
            that.state.schedule[key].active = 1;
          }
        }
        else{
          if (item.timestamp > seconds){
            that.state.schedule[key].disabled = 1;
          }              
        }
        return <li  className={showClassnameItem(item)}><a className="link-ajax" onClick={(event) => {
            that.changeVideo(item, event);
          }}><small>{item.time}</small>, {item.program.title}</a></li>;
      }
      
    });    
  }

  fetchCurrentStream(channel_id, ts) {
    var that = this;
    if (!ts){
      ts='';
    }
    fetch('https://24h.tv/v2/channels/'+ channel_id +'/stream?access_token=' + that.state.token+"&ts="+ts).then(function (response) {
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
        {(!this.state.hasStream && this.state.video) ? this.showCover() : 'no video'}
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


const showClassnameItem = (props) =>{
  let className = "list-group-item";
  if (props.active){
    className += " active";
  }
  if (props.disabled){
    className += " disabled";
  }
  return className;
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
