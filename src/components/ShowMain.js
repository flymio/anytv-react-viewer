import React, { Component } from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import { browserHistory } from 'react-router';
import LinkButton from './LinkButton';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import * as types from '../actions';
import Slider from "react-slick";
import JustLink from './JustLink';


class ShowMain extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      filters: {},
      filter: {},
      token: checkCookie(),
      deviceID: localStorage.getItem('deviceID'),
      loading: true,
    };

    this.filtersLoading = {};
    this.filters = {};
    this.params = props.match.params;
    this.fetchFilters = this.fetchFilters.bind(this);
    this.showFiltersList = this.showFiltersList.bind(this);
    this.loadFilters = this.loadFilters.bind(this);
    this.showFilter = this.showFilter.bind(this);
    this.showWides = this.showWides.bind(this);
    this.showProgram = this.showProgram.bind(this);
    this.showVideo = this.showVideo.bind(this);
    this.showLinkToProgram = this.showLinkToProgram.bind(this);
  };


  showLinkToProgram(item){
    return "/dashboard/programs/"+item.id+"/";
  };

  showLinkToVideo(item){
    return "/dashboard/videos/"+item.id+"/";
  };

  showVideo(items, classname){
    var that = this;
    return items.map(function(item,index){
      if (index<10){
      let img = item.img[0].src;
        for(let i=0;i<item.img.length;i++){
          if (item.img[i].ar == "4:3"){
            img = item.img[i].src;
          }
        }
        img = img + "?w=300&h=200&crop=true";
        return (
          <div><JustLink replaceClass="badge badge-success ajax-link float-right" to={that.showLinkToVideo(item)}><img src={img} className={classname} /></JustLink></div>
        )        
      }
    });
  }; 




  showProgram(items, classname){
    let that = this;
    if (items){
      return items.map(function(item,index){
        if (index<10){
          let img = '/avatar.png';
          if (item.img[0] && item.img[0].src){
            img = item.img[0].src;  
          }
          for(let i=0;i<item.img.length;i++){
            if (item.img[i].ar == "16:9"){
              img = item.img[i].src;
            }
          }
          img = img + "?w=300&h=200&crop=true";
          return (
            <div><JustLink replaceClass="badge badge-success ajax-link float-right" to={that.showLinkToProgram(item)}><img src={img} className={classname} /></JustLink></div>
          )
          }
      });
    }
  };  


  showWides(items, classname){

    return items.map(function(item,index){
      let img = item.images[0].src;
      if (item.images[1] && item.images[1].type == 'wide'){
        img = item.images[1].src;
      }
      //img = img + "?w=1200&h=800&crop=true";
      return (
        <div><img src={img} className={classname} /></div>
      )
    });

  };  

  showFilter(item){
    var filter_name = "mainfilter_" + item.id;
    if (isEmpty(this.state[filter_name])){
      return 'loading...';
    }

    var v = this.state[filter_name][0];
    var a = v.programs;
    if (v.template == 'vod'){
      a = v.videos;
    }
    if (v.template == 'promo-wide'){
      a = v.promo_wides;
    }
    if (v.template == 'promo-standart'){
      a = v.promo_standarts;
    }

    if (isEmpty(a)){
      return 'empty';
    }

    let settings = {
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };;    

    if (v.template == 'promo-wide'){
      return (
      <div><Slider {...settings}>
        {this.showWides(a, 'slide-maxi')}
        <br/>
      </Slider><br/></div>);    
    }


    if (v.template == 'promo-standart'){
      settings.slidesToShow = 4;

      return (
      <div><Slider {...settings}>
        {this.showWides(a, 'slide-mini')}
        <br/>
      </Slider><br/></div>);    
    }


    if (v.type == 'program'){
      settings.slidesToShow = 4;
      return (
      <div><Slider {...settings}>
        {this.showProgram(a, 'slide-program')}
        <br/>
      </Slider><br/></div>);      
    }    


    if (v.type == 'video'){
      settings.slidesToShow = 4;
      return (
      <div><Slider {...settings}>
        {this.showVideo(a, 'slide-program')}
        <br/>
      </Slider><br/></div>);      
    }  


    return a.map(function(item, index){
      if (index<6){
        return (
          <div className="Channel">
            <button className="btn btn-info">
              <div className="Channel_img">
                <img src={item.img[0].src} />
              </div>
              <span>{item.title}</span>
            </button>
          </div>

        );        
      }
    });
  }

  showFiltersList(){

    var that = this;

    if (isEmpty(this.state.filters)){
      return '';
    }

    //<span style="display:none">, ID: {item.id} !{index}!{item.type}!{item.template}</span>
    return this.state.filters.map(function(item, index){
      if (index<10){
        return (
          <div className="well well-lg">
            <h3>{item.name}</h3>
            <hr/>
            {that.showFilter(item)}
          </div>);
      }
    });
  }


  loadFilters(filters){
    var that = this;
    if (filters){
      filters.map(function(item, index){
        var filter_name = "filter_" + item.id; 
        var data = localStorage.getItem(filter_name);
        if (data){
          that.filters[filter_name] = JSON.parse(data);
          that.setState({[filter_name]: JSON.parse(data)});          
        }
        else{
          that.fetchOneFilter(item.id);
        }
      });
    }
  };


  fetchFilters(){
    var that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/filters?version=main_3.0&access_token=' + that.state.token
    ).then(function (response) {
      return response.json();
    }).then(function (result) {
      localStorage.setItem('mainFilters', JSON.stringify(result));
      that.loadFilters(result);
      that.setState({loading: false});
      that.setState({filters: result});
    });    
  }

  fetchOneFilter(id){
    var that = this;
    var filter_name = 'mainfilter_'+id;
    fetch(process.env.REACT_APP_API_URL+'/v2/filters/'+id+'?version=main_3.0&access_token=' + that.state.token
    ).then(function (response) {
      return response.json();
    }).then(function (result) {
      localStorage.setItem(filter_name, JSON.stringify(result));
      that.setState({[filter_name]: result});
    });     
  }

  componentWillMount() {
    var mainFilters = localStorage.getItem('mainFilters');
    if (mainFilters){
      var filters = JSON.parse(mainFilters);
      this.loadFilters(filters);
      this.setState({filters: filters});
    }
    else{
      this.fetchFilters();
    }
  };


  render() {

      return (
        <div>
          {this.state.filters ? this.showFiltersList() : ''}
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



export default withRouter(ShowMain);