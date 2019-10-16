import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import {withRouter} from 'react-router-dom';
import JustLink from './JustLink';
import "./profile.css";
import ReactHLS from 'react-hls';

class Programs extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      token: checkCookie(),
      loading: true,
      filters: [],
      programs: [],
    };    
    this.params = props.match.params;

    this.showCategories = this.showCategories.bind(this);
    this.showPrograms = this.showPrograms.bind(this);

  }


  checkPrograms(){
    let that = this;
    const storePrograms = localStorage.getItem('programs');
    if (storePrograms){
      let programs = JSON.parse(storePrograms);
      this.setState({ 'programs': programs});
      this.setState({ 'loading': false});
    }
    else{
      fetch('https://24h.tv/v2/programs?access_token=' + that.state.token).then(function (response) {
        return response.json();
      }).then(function (result) {
        that.setState({ 'programs': result});
        that.setState({ 'loading': false});
        localStorage.setItem('programs', JSON.stringify(result));
      });
    }
  }

  fetchFilters(){
    var that = this;
    fetch('https://24h.tv/v2/programs/filters?access_token=' + that.state.token).then(function (response) {
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

  showCategories(){
    let that = this;
    let data = this.state.filters;

    return data.map((item, key) =>      
        <button className={this.showClassCategory(item)} onClick={(event) => {
        that.selectCurrentCategory(item);
        console.log(event, item);
      }}>{item.name}</button>
    );

    return <h1>hello, i'm categories</h1>;
  }

  showPrograms(){
    if (!this.state.filter_id){
      return '';
    }
    return <h1>hello, i'm programs</h1>;
  }


  componentWillMount() {
    const storeFilters = localStorage.getItem('programs_filters');
    if (storeFilters){
      let filters = JSON.parse(storeFilters);
      this.setState({ 'filters': filters});
      this.checkPrograms();
    }
    else{
      this.fetchFilters();
    }
    

  };

  showClassCategory = function(item){
    if (item.selected){
      return "btn btn-success btn-programs"; 
    }
    return "btn btn-programs";
  } 



  render() {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    return (
      <div>
        <h1>programs</h1>
        <hr/>
        {this.state.filters ? this.showCategories() : '<em>filters</em><br/>'}
        {this.state.programs ? this.showPrograms() : '<em>programs</em><br/>'}

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

export default withRouter(Programs);