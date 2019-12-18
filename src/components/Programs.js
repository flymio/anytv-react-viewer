import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import {withRouter} from 'react-router-dom';
import JustLink from './JustLink';
import "./profile.css";
import ReactHLS from 'react-hls';
import LinkButton from './LinkButton';

class Programs extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      token: checkCookie(),
      loading: true,
      filters: [],
      program_id: '',
      programs: [],
      selected: {},
      page: 0,
      limit: 24,
    };    
    this.schedules = {};
    this.params = props.match.params;
    this.showCategories = this.showCategories.bind(this);
    this.showPrograms = this.showPrograms.bind(this);
    this.showVideos = this.showVideos.bind(this);
    this.checkPrograms = this.checkPrograms.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.loadProgram = this.loadProgram.bind(this);
    this.showProgram = this.showProgram.bind(this);
    this.showGenres = this.showGenres.bind(this);
    this.showSchedule = this.showSchedule.bind(this);
    this.showLinkToChannel = this.showLinkToChannel.bind(this);
  }


  showVideos(){
    this.checkPrograms(true);
    this.setState({'loading': false});
  };


  loadProgram(program_id){
    let that = this;
      fetch(process.env.REACT_APP_API_URL+'/v2/programs/'+program_id+'/schedule?access_token=' + that.state.token).then(function (response) {
        return response.json();
      }).then(function (result) {
        that.setState({ 'loading': false});
        if (result){
          that.setState({ 'program': result});          
        }
      });
  };

  showGenres(program){
      return program.genres.map((item, key) =>      
        <div className="badge badge-success badge-padding">{item.name}</div>
      );
  };

  showLinkToChannel(item){
    return "/dashboard/channels/"+item.channel_id+"/"+item.timestamp;
  };

  showSchedule(schedule){
    console.log(schedule);
      return schedule.map((item, key) =>      
        <li className="list-group-item">
          <span>{item.channel.name}, {item.date} {item.time} {item.episode ? <strong>{item.episode.title}</strong> : ''}
          {item.episode && item.episode.season ? <em>, сезон {item.episode.season}</em> : ''}
          {item.episode && item.episode.series ? <em>, серия {item.episode.series}</em> : ''}
          </span>
          &nbsp;<JustLink replaceClass="badge badge-success ajax-link float-right" to={this.showLinkToChannel(item)}>перейти к просмотру</JustLink>
        </li>
      );

  };

  showProgram(){
    let that = this;


    console.log(this.state.program);

    let item = this.state.program[0].program;
    let schedule = this.state.program;
    return <div className="Program">
          <h3>{item.title}</h3>
          <div className="ProgramDescription">{item.description}</div>
          <div className="ProgramGenres">{that.showGenres(item)}<br/><br/></div>
          {item.img[0] ? <div className="ProgramSlider"><img src={item.img[0].src} /></div> : ''}
          <br/>
          <h4>Расписание</h4>
          <br/>
          <ul class="list-group">
          {that.showSchedule(schedule)}
          </ul>
      </div>;

  }

  checkPrograms(force){
    let that = this;
    let url = '&limit='+that.state.limit;
    if (force){
      that.setState({'programs': ''});
    }
    console.log(that.state);
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
    fetch(process.env.REACT_APP_API_URL+'/v2/programs?access_token=' + that.state.token+url).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (that.state.page > 0 ){
        result = that.state.programs.concat(result);          
      }
      that.setState({ 'programs': result});
      that.setState({ 'loading': false});
      if (!force && !that.state.page){
        localStorage.setItem('programs', JSON.stringify(result));          
      }
    });
  }

  fetchFilters(){
    var that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/programs/filters?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      that.setState({ 'filters': result});
      localStorage.setItem('programs_filters', JSON.stringify(result));
      that.checkPrograms();
    });
  };

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
        that.showVideos();
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
        that.program_id = item.id;
        that.filter_id = '';
        that.state.selected[item.id]='';
        that.selectCurrentCategory(item);
        that.showVideos();
      }}>{item.name}</button><br/>
      {item.selected ? that.showFilter(item) : ''}
      </div>
    );

    return <h1>hello, i'm categories</h1>;
  }

  showPrograms(){
    var that = this;
    if (!that.state.programs){
      return '';
    }
    let data = that.state.programs;
    return data.map((item, key) =>
      <div className="Channel">
          <LinkButton
            to={linkToChannel(item)}            
          >
          <div className="Channel_img"><img src={item.cover||item.icon} /></div>
          <span>{item.title}</span>
          </LinkButton>
        </div>
    );    
  }



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
        this.checkPrograms();
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  };


  componentWillMount() {
    const params = this.props.match.params;
    if (params && !params.url_id){
      const storeFilters = localStorage.getItem('programs_filters');
      if (storeFilters){
        let filters = JSON.parse(storeFilters);
        this.setState({ 'filters': filters});
        this.checkPrograms();
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
      if (!this.schedules[params.url_id]){
        this.schedules[params.url_id] = true;
        that.loadProgram(params.url_id);  
      }
      
      return (
        <div>
          <br/>
          {that.state.program ? that.showProgram() : ''}
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
        <h1>programs</h1>
        <hr/>
        <div class="row">
        {this.state.filters ? this.showCategories() : '<em>filters</em><br/>'}
        </div>
        <br/>
        {this.state.programs ? this.showPrograms() : ''}
        {!this.state.loading ? <div style={stylePaging}><br clear="both" /><button id="lazyloading" className="btn btn-success" onClick={(event) => {
        //this.setState({'loading': true});
        that.state.page++; 
        that.checkPrograms();
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


const linkToChannel = (props) => {
  return "/dashboard/programs/" + props.id + "/";
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

export default withRouter(Programs);