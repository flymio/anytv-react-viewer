import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import {withRouter} from 'react-router-dom';
import JustLink from './JustLink';
import "./profile.css";

import LinkButton from './LinkButton';

import ReactHLS from 'react-hls';


class Videos extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      token: checkCookie(),
      user: {},
      page: 0, 
      selected: {},
      loading: true,
      schedule: [],
      channel: {},
      channelName: '',
      episode: {},
      episodes: {},
      episode_id: 0,
      video: false,
      limit: 12,
    };    
    this.video_id = 0;
    this.episode_id = 0;

    this.showClassNameEpisode = this.showClassNameEpisode.bind(this);
    this.showCategories = this.showCategories.bind(this);
    this.checkVideos = this.checkVideos.bind(this);
    this.showVideos = this.showVideos.bind(this);
    this.showGenres = this.showGenres.bind(this);    
    this.handleScroll = this.handleScroll.bind(this);
    this.fetchFilters = this.fetchFilters.bind(this);
    this.loadVideo = this.loadVideo.bind(this);
    this.showVideo = this.showVideo.bind(this);
    this.showLinkToEpisode = this.showLinkToEpisode.bind(this);
    this.showEpisodes = this.showEpisodes.bind(this);
    this.myRef = React.createRef();

    this.params = props.match.params;
  }



  showGenres(program){
      return program.genres.map((item, key) =>      
        <div className="badge badge-success badge-padding">{item.name}</div>
      );
  };


  showLinkToEpisode(item){
    let video = this.state.video;
    return "/dashboard/videos/"+video.id+"/"+item.id;
  };


  scroll(ref) {
    ref.current.scrollIntoView({behavior: 'smooth'})
  };


  showEpisodes(schedule){
    let that = this;

    if (schedule.length == 0){
      return <li className={that.showClassNameEpisode()}>
          <span>
            {that.state.video.title}
          </span>
          &nbsp;<JustLink replaceClass="badge badge-success ajax-link float-right" to={that.showLinkToEpisode(that.state.video)}>перейти к просмотру</JustLink>
        </li>
    }
      return schedule.map(function(item, key){      
        return (<li className={that.showClassNameEpisode(item.id, that.state.episode_id)}>
          <span>{item.list_title}
          {item.episode && item.episode.season ? <em>, сезон {item.episode.season}</em> : ''}
          {item.episode && item.episode.series ? <em>, серия {item.episode.series}</em> : ''}
          </span>
          &nbsp;<JustLink replaceClass="badge badge-success ajax-link float-right" to={that.showLinkToEpisode(item)}>перейти к просмотру</JustLink>
        </li>
        )
      });
  };


  showClassNameEpisode(item, episode_id){
    console.log(item, episode_id)
    if (item && item == episode_id){
      return "list-group-item active";   
    }
    return "list-group-item";
  }
  fetchFilters(){
    var that = this;
    fetch('https://24h.tv/v2/videos/filters?version=2.5&access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      that.setState({ 'filters': result});
      localStorage.setItem('videos_filters', JSON.stringify(result));
      that.checkVideos();
    });
  };


  loadEpisodeStream(video_id, episode_id){
    var that = this;
    if (this.state.episodes[episode_id]){
      return;
    }
    let episodes = {};
    episodes[episode_id]=true;
    that.setState({ 'episodes': episodes});

    if (video_id && episode_id && episode_id == video_id){
      fetch('https://24h.tv/v2/videos/'+video_id+'/stream?access_token=' + that.state.token).then(function (response) {
        return response.json();
      }).then(function (result) {
        that.setState({ 'episode': result});
        that.setState({ 'loading': false});
        that.scroll(that.myRef);
      });
      return;
    }

    fetch('https://24h.tv/v2/videos/'+video_id+'/episodes/'+episode_id+'/stream?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      that.scroll(that.myRef);
      that.setState({ 'episode': result});
      that.setState({ 'episode_id': episode_id});
      that.setState({ 'loading': false});
    });
  }


  loadVideo(video_id, episode_id){
    var that = this;
    fetch('https://24h.tv/v2/videos/'+video_id+'?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      that.setState({ 'video': result});
      if (episode_id){
        that.loadEpisodeStream(video_id, episode_id);        
      }
      else{
        that.setState({ 'loading': false});        
      }
    });
  };


  showEpisode(){
    let that = this;
    return (<div>
      {this.state.episode && this.state.episode.hls ? <div ref={this.myRef}><ReactHLS width="670" url={this.state.episode.hls}/></div> : <div ref={this.myRef}></div>}
    </div>);
  }


  showVideo(){
    let that = this;
    let item = this.state.video;
    
    return <div className="Program">
          <h3>{item.title}</h3>
          <div className="ProgramDescription">{item.description}</div>
          {that.props.match.params.url_id2 ? that.showEpisode() : ''}
          <div className="ProgramGenres">{that.showGenres(item)}<br/><br/></div>
          {item.img[0] ? <div className="ProgramSlider"><img src={item.img[0].src} /></div> : ''}
          <br/>
          <br/>
          <ul class="list-group">
          {that.showEpisodes(item.episodes)}
          </ul>
      </div>;
  };


  handleScroll(event) {
    let lazyTop = document.getElementById("lazyloading");
    if (this.state.loading || this.state.program || !lazyTop){
      return true;
    }
    lazyTop = lazyTop.offsetTop;
    let scrollTop = event.target.scrollingElement.scrollTop + window.innerHeight;
    if (scrollTop > lazyTop && !this.state.loading){
        this.state.page++; 
        this.setState({ 'loading': true});
        this.checkVideos();
    }
  };





  showVideos(){
    var that = this;
    if (!that.state.videos){
      return 'fuck';
    }
    let data = that.state.videos;
    return data.map((item, key) =>
      <div className="Channel ChannelVideo">
          <LinkButton
            to={linkToVideo(item)}
            onClick={(event) => {
              that.setState({'loading': true});
            }}
          >
          <div className="Channel_img"><img src={item.cover||item.icon} /></div>
          <span class="ChannelTitle">{item.title}</span>
          </LinkButton>
        </div>
    );    
  }

  checkVideos(force){
    let that = this;
    let url = '&limit='+that.state.limit;
    if (force){
      that.setState({'videos': ''});
    }
    if (that.filter_id){
      url+="&filters="+that.filter_id;
    }
    else if (that.program_id){
      url+="&categories="+that.program_id; 
    }
    if (that.state.page>0){
      let offset = parseInt(this.state.page * that.state.limit);
      url+="&offset="+offset;
    }
    fetch('https://24h.tv/v2/videos?access_token=' + that.state.token+url).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (that.state.page > 0 && that.state.videos && that.state.videos.length){
        result = that.state.videos.concat(result);          
      }
      console.log(result);
      that.setState({ 'videos': result});
      that.setState({ 'loading': false});
      if (!force && !that.state.page){
        localStorage.setItem('videos', JSON.stringify(result));          
      }
    });
  }



  selectCurrentCategory(item){
    for(let i=0; i < this.state.filters.length; i++){
      if (this.state.filters[i].id != item.id && this.state.filters[i].selected){
        this.state.filters[i].selected = false;
      }
      if (this.state.filters[i].id == item.id){
        this.state.filters[i].selected = true;
      }
    }
    this.setState({'filters': this.state.filters});    
  }


  showFilter(item){
    var that = this;
    let filters = item.filters;
    if (filters[0].name != 'Все'){
      filters.unshift({id:0, name:'Все'});      
    }
    return <select className="category_filter" value={this.state.selected[item.id]} onChange={(event) => {        
        that.state.selected[item.id] = event.target.value;
        this.state.page = 0;
        that.filter_id = event.target.value;
        that.checkVideos(true);
        return true;
      }}>{this.showFilterElements(filters)}</select>;
  };

  showFilterElements(filters){
      return filters.map((item, key) =>      
        <option value={item.id}>{item.name}</option>      
      );
  };  

  showCategories(){
    let that = this;
    let data = this.state.filters;

    return data.map((item, key) =>      
        <div className="col-sm"><button className={this.showClassCategory(item)} onClick={(event) => {
        that.setState({'loading': true});
        that.setState({'program_id': item.id});
        this.state.page = 0;
        //that.program_id = item.id;
        that.filter_id = item.id;
        that.state.selected[item.id]='';
        that.selectCurrentCategory(item);
        that.checkVideos(true);
      }}>{item.name}</button><br/>
      {item.selected ? that.showFilter(item) : ''}
      </div>
    );

    return <h1>hello, i'm categories</h1>;
  }
  


  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  };

  componentWillMount() {
    console.log('mount');
    const params = this.props.match.params;
    if (params && !params.url_id){
      const storeFilters = localStorage.getItem('videos_filters');
      if (storeFilters){
        let filters = JSON.parse(storeFilters);
        this.setState({ 'filters': filters});
        this.checkVideos();
      }
      else{
        this.fetchFilters();
      }
    }
  };


  showClassCategory = function(item){
      if (item.selected){
        return "btn btn-success btn-programs"; 
      }
      return "btn btn-programs";
    } 


  render() {
    let that = this;
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const stylePaging = { marginLeft: '420px' };

    const params = that.props.match.params;

    if (params && params.url_id){
      if (!that.video_id || (that.video_id != params.url_id) || (params.url_id2 != that.episode_id)){
        that.video_id = params.url_id;
        that.episode_id = params.url_id2;
        that.loadVideo(params.url_id, params.url_id2);
      }
      return (
        <div>
          <br/>
          {that.state.video && !that.state.loading ? that.showVideo() : ''}
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
        <h1>videos</h1>
        <hr/>
        <div class="row">
        {this.state.filters ? this.showCategories() : ''}
        </div>
        <br/>
        {this.state.videos ? this.showVideos() : ''}
        {!this.state.loading ? <div style={stylePaging}><br clear="both" /><button id="lazyloading" className="btn btn-success" onClick={(event) => {
        //this.setState({'loading': true});
        that.state.page++; 
        that.checkVideos();
        return false;   
      }}>Loading</button></div> : ''}
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



const linkToVideo = (props) => {
  return "/dashboard/videos/" + props.id + "/";
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
