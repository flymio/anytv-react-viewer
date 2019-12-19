import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import LinkButton from './LinkButton';

import JustLink from './JustLink';
import { checkCookie, setCookie} from '../utils/cookies';

import ReactHLS from 'react-hls';


class MenuTop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      profile: {},      
      profiles: [],
      checkVideoTimer: '',
      search: '',
      searchResults: [],
      token: checkCookie(),
      profileNull: false,
      reacthls: '',
      selected: {
        channels:'',
        programs:'',
        videos:'',
        devices:'',
      }
    };


    this.videoURL = '';
    this.need_timer = 0;
    this.params = props.match.params;    



    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.showOtherProfiles = this.showOtherProfiles.bind(this);
    this.saveCurrentProfile = this.saveCurrentProfile.bind(this);   
    this.logout = this.logout.bind(this); 
    this.showMenuClass = this.showMenuClass.bind(this);
    this.showResults = this.showResults.bind(this);
    this.checkHLS = this.checkHLS.bind(this);
  }



  fetchSearch(that, search){
    fetch(process.env.REACT_APP_API_URL+'/v2/esearch?access_token=' + that.state.token+'&text='+search, {
      method: 'GET',
      headers:{
        "Content-Type": "application/json",
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {   
      if (!result.error){
        that.setState({searchResults: result}) ;        
      }
    });    
  };



  checkHLS(){
    const video_url = localStorage.getItem("video_url") || '';
    if (video_url && this.videoURL != video_url){
      this.videoURL = video_url;
      this.setState({
        reacthls: video_url,
      });
      //alert(video_url);
      window.setTimeout(this.checkHLS(), 500);
    }
    if (!video_url && this.state.reacthls){
      this.setState({
        reacthls: false,
      });
      window.setTimeout(this.checkHLS(), 500);
    }    
  }

  showResults(){
    let that = this;
    if (isEmpty(this.state.searchResults)){
      return '';
    }
    if (this.state.searchResults){    
      return this.state.searchResults.map(function(item,key){
        if (item.video){
          let img = getImg(item.video.img);
          return <div className="Channel">
          <LinkButton
            to={linkToVideo(item.video)}
          >
            <div className="Channel_img"><img src={img} /></div>
            <span>{item.video.title}</span>
            </LinkButton>
          </div>
        }
        if (item.program){

          let img = getImg(item.program.img);

          return <div className="Channel">
          <LinkButton
            to={linkToProgram(item.program)}
          >
            <div className="Channel_img"><img src={img} /></div>
            <span>{item.program.title}</span>
            </LinkButton>
          </div>
        }
      });
    }

  };

  handleChangeSearch = event => {
    var that = this;
    this.setState({
      [event.target.id]: event.target.value
    });

    console.log(that.props);


    that.props.history.push({
      pathname: that.props.location.pathname,
      hash: event.target.value,
      state: {search: event.target.value}
    });

    if (this.need_timer){
      window.clearTimeout(that.need_timer);
    }
    that.need_timer = window.setTimeout(that.fetchSearch(that, event.target.value), 1000);
  }

  logout(){
    var that = this;


    localStorage.removeItem('not_register');
    localStorage.removeItem('deviceID');
    localStorage.removeItem('profile');
    localStorage.removeItem('profiles');
    localStorage.removeItem('videos');
    localStorage.removeItem('videos_filters');
    localStorage.removeItem('mainFilters');
    localStorage.removeItem('programs');
    localStorage.removeItem('programs_filters');
    localStorage.removeItem('channels');


    setCookie("deviceIDToken", '', 0);
    setCookie("token", '', 0);


    that.props.history.push('/');

  };

  saveCurrentProfile = function(item){
    var that = this;
    let data = {
      id: item.id,
    };
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
      
      that.props.history.push('/');
    });    
    
  };  


  componentDidMount(){
    //localStorage.removeItem('video_url');
  }

  componentWillMount() {
    const storeProfiles = localStorage.getItem('profiles');
    const storeProfile = localStorage.getItem('profile');
    if (storeProfiles){
      let profiles = JSON.parse(storeProfiles);
      this.setState({ 'profiles': profiles});
      if (!storeProfile){
        this.setState({ 'profileNull': true});
        localStorage.setItem('profile', JSON.stringify(profiles[0]));        
      }
      else{
          let profile = JSON.parse(storeProfile);
          this.setState({ 'profile': profile});
          this.setState({ 'profileNull': false});
      }
    }
    if (this.props.location.hash){
      let search = decodeURIComponent(this.props.location.hash);
      search = search.substr(1, search.length-1);
      this.setState({'search': search});
      this.fetchSearch(this, search);
    }

    this.checkVideoTimer = window.setTimeout(this.checkHLS(), 500);

  };

  showOtherProfiles(current){
    let that = this;
    if (!this.state.profiles){
      return '';
    }
    return this.state.profiles.map(function(item,key){
      if (item.id != current.id){
        return <div class="header__user-profile">
                  <JustLink replaceClass="header__user d-flex align-items-center" onClick={(event) => {
                        that.saveCurrentProfile(item)
                    }}>
                    <div className="header__user-avatar flex-shrink-0">
                      <img src={item.icon} alt={item.name} className="header__user-img" / >
                    </div>
                    <div className="header__user-name flex-grow-1">{item.name}</div>
                  </JustLink>
              </div>;
        }
    });
  }

  showMenuClass(item){
    if (this.state.selected[item]){
      return 'header__nav-link nav-link active';
    }
    return 'header__nav-link nav-link';
  };

  render() {
    this.state.selected = {};
    if (this.props.match.params && this.props.match.params.url){
      this.state.selected[this.props.match.params.url] = 'btn-selected';
    }
    else{
      this.state.selected['main'] = 'btn-selected';
    }


    if (this.state.search && !this.props.location.hash){
      this.setState({'searchResults': [], 'search': ''});
    }
    if (!this.state.search && this.props.location.hash){
      let search = decodeURIComponent(this.props.location.hash);
      search = search.substr(1, search.length-1);
      this.setState({'search': search});
      this.fetchSearch(this, search);
    }
      return (
        <div>
        <header class="header d-flex justify-content-start justify-content-lg-between align-items-center">
            <ul class="header__nav nav d-block d-lg-flex" id="nav">
              <li class="header__nav-item nav-item">
                <JustLink replaceClass={this.showMenuClass('main')} to="/dashboard/">Главная</JustLink>
              </li>
              <li class="header__nav-item nav-item">
                <JustLink replaceClass={this.showMenuClass('channels')} to="/dashboard/channels/">Телеканалы</JustLink>
              </li>
              <li class="header__nav-item nav-item">
               <JustLink replaceClass={this.showMenuClass('programs')} to="/dashboard/programs/">ТВ архив</JustLink>
              </li>
              <li class="header__nav-item nav-item">
                <JustLink replaceClass={this.showMenuClass('videos')} to="/dashboard/videos/">Кинотеатры</JustLink>
              </li>
              <li class="header__nav-item nav-item">
                <JustLink replaceClass={this.showMenuClass('persons')} to="/dashboard/persons/">Персоны</JustLink>
              </li>
              <li class="header__nav-item nav-item header__nav-item__search">
                <input type="search" value={this.state.search}  id="search" onChange={this.handleChangeSearch} className="form-control search-input" />
              </li>
            </ul>
            <div class="header__user-container flex-shrink-0">
              <div class="header__user d-flex align-items-center">

                <div class="header__user-name flex-grow-1">
                  {this.state.profile ? <span>{this.state.profile.name}</span> : ''}
                  {this.state.profileNull ? <span>No Name</span> : '' }
                </div>
                <div class="header__user-avatar flex-shrink-0">
                  {this.state.profileNull ? <LinkButton classNameReplace="btn btn-avatar" to='/dashboard/profile/'><img className="header__user-img" src="/avatar.png" /></LinkButton> : '' }
                  {this.state.profile && !this.state.profileNull ? <LinkButton classNameReplace="btn btn-avatar" to='/dashboard/profile/'><img src={this.state.profile.icon} /></LinkButton> : '' }
                </div>
              </div>              
            <div class="header__user-nav">
                <div class="header__user-nav-content">
                  <div class="header__user-nav-wrapper">
                    <div class="header__user-profiles">
                      {this.state.profiles ? this.showOtherProfiles(this.state.profile) : ''}
                    </div>
                    <div class="header__user-profiles">
                      <div class="header__user-profile">
                        <JustLink replaceClass="header__user d-flex align-items-center" to="/dashboard/profile/">
                          <div class="header__user-name flex-grow-1">Профили</div>
                        </JustLink>
                      </div>
                      <div class="header__user-profile">
                        <JustLink replaceClass="header__user d-flex align-items-center" to="/dashboard/devices/">
                          <div class="header__user-name flex-grow-1">Мои устройства</div>
                        </JustLink>
                      </div>
                      <div class="header__user-profile">
                        <JustLink replaceClass="header__user d-flex align-items-center" to="/help/">
                          <div class="header__user-name flex-grow-1">Помощь</div>
                        </JustLink>
                      </div>
                      <div class="header__user-profile">
                        <JustLink replaceClass="header__user d-flex align-items-center" onClick={(event) => {
                          this.logout()
                        }}>
                          <div class="header__user-name flex-grow-1">Выйти</div>
                        </JustLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="header__pull d-block d-lg-none flex-shrink-0" id="pull">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </header>
          <div>
            {this.state.search ? <div className="search_results">Результаты поиска <strong>{this.state.search}</strong><br/><br/><br/>{this.showResults()}</div> : '' }
          </div>
            <div className="miniPlayer">
              {this.state.reacthls ? <div className="miniPlayer"><ReactHLS width="300" height="auto" url={this.state.reacthls} autoplay="true" /></div> : ''}
            </div>
          </div>
      );
  }
}

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

const linkToVideo = (props) => {
  return "/dashboard/videos/" + props.id + "/";
}

const linkToProgram = (props) => {
  return "/dashboard/programs/" + props.id + "/";
}

const getImg = (imgs) => {
  var img = "/avatar.png";
  if (imgs.length < 1){
    return img
  }
  img = imgs[0].src;
  for(let i=0; i< imgs.length; i++ ){
    if (imgs[i].type == 'poster' || imgs[i].ar == "16:9"){
      img = imgs[i].src;
    }
  }
  return img + "?w=350&h=163&crop=1";
}

export default withRouter(MenuTop);