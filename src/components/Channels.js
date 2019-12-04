import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import {withRouter} from 'react-router-dom';
import JustLink from './JustLink';
import "./profile.css";

import ReactHLS from 'react-hls';
import LinkButton from './LinkButton';


class Channels extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      token: checkCookie(),
      user: {},
      loading: true,
      schedule: [],
      channel: {},
      currentCategory:'',
      channelName: '',
      startDate: '',
      page: 0,
      channels_categories: [],
      video: false,
      current: new Date(),
      currentTime: (new Date()).getTime(),
    };    
    this.fetchCategories = this.fetchCategories.bind(this);
    this.showChannels = this.showChannels.bind(this);
    this.showCategoriesList = this.showCategoriesList.bind(this);
    this.showCategories = this.showCategories.bind(this);
    this.showChannel = this.showChannel.bind(this);
    this.loadChannel = this.loadChannel.bind(this);
    this.showDates = this.showDates.bind(this);
    this.showCurrentDate = this.showCurrentDate.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
    this.showClassnameCategory = this.showClassnameCategory.bind(this);


    this.params = props.match.params;
  }


  loadChannel(channel_id, timestamp, force){
    let that = this;
    if (!isEmpty(this.state.schedule) && !force){  
      return;
    }
    let url = '';
    if (that.startDate){
      url="&date="+that.startDate;
    }

    fetch(process.env.REACT_APP_API_URL+'/v2/channels/'+channel_id+'/schedule?access_token=' + that.state.token + url).then(function (response) {
      return response.json();
    }).then(function (result) {
      that.setState({'schedule': result});

      let channelsList = localStorage.getItem('channels');
      if (channelsList){
        let channels = JSON.parse(channelsList);
        for(let i=0; i< channels.length; i++){
          if (channels[i].id == channel_id){
            that.setState({'channel': channels[i] });
            that.setState({'channelName': channels[i].name });
          }
        }
      }
      that.setState({'loading': false });
      that.fetchCurrentStream(channel_id, timestamp);
    });

  }


  showDates(){
    var that = this;

    const params = that.props.match.params;

    var today = this.state.current;
    var current = this.state.current.getTime();
    var dateString = today.getDate() + "." + (today.getMonth() + 1);
    var dateFormat = (today.getYear()+1900)+"-"+(today.getMonth() + 1) + "-" + today.getDate(); 
    var dates = [
      {
        title: 'сегодня, '+dateString,
        seconds: current,
        date: dateFormat,
      }
    ];

    for(let i=1; i<=5; i++){
      let currentMilliseconds = current - 86400000*i;
      let dt = new Date(currentMilliseconds);
      let dateString = dt.getDate() + "." + (dt.getMonth() + 1);
      let dateFormat = (dt.getYear()+1900)+"-"+(dt.getMonth() + 1) + "-" + dt.getDate(); 
      dates.push({
        title: dateString,
        seconds: currentMilliseconds,
        date: dateFormat,
      });
    }

    dates = dates.reverse();

    return dates.map(function(item, index){
      return (<button onClick={(event) => {
            let date = item.seconds+"";
            that.startDate = item.date;
            that.loadChannel(params.url_id, '', true);
            that.setState({currentTime: item.seconds});
          }}
          className={that.showCurrentDate(item)}>{item.title}
      </button>);
    });

  } 


  showCurrentDate(item){
    if (item.seconds == this.state.currentTime){
      return "btn btn-date btn-success";
    }
    return "btn btn-date btn-info";
  }

  showCover = function(){
    return <img src={this.state.video_cover} />;
  };

  showSchedule = function(data){
    let that = this;
    if (isEmpty(data)){
        return '';
    }
    const params = that.props.match.params;
    var timestamp = params.url_id2 || 0;
    var hour = new Date().getHours();
    var seconds = (new Date().getTime()+"").substr(0,10);
    var hour_begin = 0;
    var seconds_begin = 0;
    for(var i=0; i< data.length; i++){
      var t = data[i].time.split(":")[0];
      var s = data[i].timestamp;
      if ((seconds <= s + data[i].duration && seconds >= data[i].timestamp && !hour_begin) || (timestamp && timestamp == data[i].timestamp)){
        hour_begin = i;
        seconds_begin = data[i].timestamp;
      }
    }
    seconds_begin = data[0].timestamp;
    hour_begin=0;

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
          }}><small>{item.date}, {item.time}</small>, {item.program.title}</a></li>;
      }
      
    });    
  }

  showClassnameCategory = (props) =>{
    let className = "btn ChannelSelector";
    if (!props && !this.state.currentCategory){
      className += " active";
      return className;
    }
    if (props && this.state.currentCategory && props.id == this.state.currentCategory){
      className += " active";
    }
    return className;
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
        this.state.schedule[i].active=0;
      }
    }
    this.setState({schedule: this.state.schedule});
    this.fetchCurrentStream(this.props.match.params.url_id, item.timestamp);
  };


  fetchCurrentStream(channel_id, ts) {
    var that = this;
    if (!ts){
      ts='';
    }
    fetch(process.env.REACT_APP_API_URL+'/v2/channels/'+ channel_id +'/stream?access_token=' + that.state.token+"&ts="+ts).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result);
      that.setState({ hasStream: true});
      that.setState({ streamUrl: result.hls});      
    });
  }  


  showChannel(){
    return (
      <div>
        <h1>{this.state.channelName}</h1>
        <div class="currentVideo">
        {(!this.state.hasStream) ? this.showCover() : ''}
        {this.state.hasStream ? <ReactHLS url={this.state.streamUrl} autoplay="true" /> : ''}
        </div>
        {this.showDates()}
        <ul class="list-group">
        {this.showSchedule(this.state.schedule)}
        </ul>
      </div>
    );
  }

  fetchCategories(){
    var that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/channels/categories?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {

      let channels = [];
      for(let i=0; i < result.length; i++){
        for(let j=0; j < result[i].channels.length; j++){
          let subitem = result[i].channels[j];
          subitem.category_id = result[i].id;
          channels.push(subitem);
        }
      }    

      that.setState({'channels': channels});
      localStorage.setItem('channels', JSON.stringify(channels));
      that.setState({'channels_categories': result});
      that.setState({'loading': false });
    });
  };

  componentWillMount() {
    this.fetchCategories();
  }


  showCategoriesList(){
    let that = this;
    let data = this.state.channels_categories;
    if (!data){
      return '';
    }
    return data.map((item, key) =>
      <div className="Channel">
        <button className={that.showClassnameCategory(item)} onClick={(event) => {
                that.setState({currentCategory: item.id});
              }}>{item.name}</button>
      </div>);

  };

  showChannels(){
    let that = this;
    let data = this.state.channels;
    if (!data){
      return '';
    }
    return data.map(function(item, key){
      if (!that.state.currentCategory || item.category_id == that.state.currentCategory){
        return <div className="Channel">
            <LinkButton
              onClick={(event) => {
                that.setState({schedule: false});
              }}
              to={linkToChannel(item)}            
            >
            <div className="Channel_img"><img src={item.cover.light_bg||item.icon} /></div>
            <span>{item.name}</span>
            </LinkButton>
        </div>        
      }
    });
  };


  showCategories(){

    var that = this;
    if (!that.state.channels_categories){
      return '';
    }
    return <div className="ChannelContainer">
      <div className="ChannelFilters">
        {this.state.channels ? <div className="Channel"><button className={that.showClassnameCategory()}  onClick={(event) => {                
                that.setState({currentCategory: ''});
              }}>Все</button></div> : ''}
        {this.showCategoriesList()}
      </div>
      <br clear="both" />
      <div class="ChannelContent">
        {this.showChannels()}
      </div>
    </div>
    let data = that.state.channels_categories;
    return data.map((item, key) =>
      <div className="Channel">
          <h4>{item.name}</h4><br/>
      </div>
    );    

    return 'loaded';
  }

  render() {
    let that = this;

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const params = that.props.match.params;

    if (params && params.url_id){
      that.loadChannel(params.url_id, params.url_id2 || 0);
      return (
        <div>
          <br/>
          {that.state.channel ? that.showChannel() : ''}
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

    return (
      <div>
        <h1>channels</h1>
        {this.state.channels_categories ? this.showCategories() : ''}
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

const linkToChannel = (props) => {
  return "/dashboard/channels/" + props.id + "/";
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

export default withRouter(Channels);
