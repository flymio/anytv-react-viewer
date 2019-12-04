import React, { Component } from "react";
import LinkButton from './LinkButton';
import { ClipLoader } from 'react-spinners';
import {checkCookie} from '../utils/cookies';
import {withRouter} from 'react-router-dom';
import JustLink from './JustLink';
import "./profiles.css";

import { Button, FormGroup, FormControl, ControlLabel, Alert} from "react-bootstrap";



class ProfileAdd extends React.Component {
    
  constructor(props){
    super(props);
    this.createProfile = this.createProfile.bind(this);

    this.state = {
      user: {},
      name: '',
      token: checkCookie(),
      profile_id: '',
      profiles: '',
      profile: '',
      loading: true,
    };    

  };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  validateForm() {
    return (this.state.name.length > 0) && !this.state.loading;
  }

  createProfile = event => {
    event.preventDefault();

    var that = this;
    let data = {
      name: that.state.name,
      profile_id: this.state.profile_id,
    };
    that.setState({loading: true});
    fetch(process.env.REACT_APP_API_URL+'/v2/users/self/profiles?access_token=' + that.state.token, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        "Content-Type": "application/json",
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      //console.log(result);
      localStorage.removeItem('videos');
      localStorage.removeItem('videos_filters');
      localStorage.removeItem('mainFilters');
      localStorage.removeItem('programs');
      localStorage.removeItem('programs_filters');
      localStorage.removeItem('channels');
      localStorage.removeItem('profiles');
      localStorage.removeItem('profile');
      window.top.location.reload();
    });    
    
  };



  showProfiles(){
    if (this.state.profiles){
      return this.state.profiles.map((item, key) =>
        <option value={item.id}>{item.name}</option>
      );
    }
  }

  getDefaultProfiles(){
    var that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/profiles?access_token='+that.state.token, {
      method: 'GET',
      headers:{
        "Content-Type": "application/json",
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {    
      that.setState({ profiles: result});
      that.setState({ profile_id: result[0].id});
      that.setState({ loading: false});
    });       
  }


  componentWillMount() {
    this.getDefaultProfiles();
  };
  render() {

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

      return (          
        <div className="profiles">
          <h1>Созданиие персонажа111</h1>
          <form onSubmit={this.createProfile}>
            {this.state.message ? <Alert bsStyle="danger">Unable to log in with provided credentials.</Alert> : ''}
            <FormGroup controlId="profile_id" bsSize="large">
              <ControlLabel>Тип персонажа</ControlLabel>
              <FormControl componentClass="select" id="profile_id" name="profile_id" onChange={this.handleChange} value={this.state.profile_id}>
              {this.showProfiles()}
              </FormControl>
            </FormGroup>
            <FormGroup controlId="name" bsSize="large">
              <ControlLabel>Название персонажа</ControlLabel>
              <FormControl
                autoFocus
                type="text"
                id="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </FormGroup>          
            <Button
              block
              bsSize="large"
              bsStyle="primary"
              disabled={!this.validateForm()}
              type="submit"
            >
              Создать
            </Button>
            <br/>
            <div style={style}>
            <ClipLoader
              sizeUnit={"px"}
              size={50}
              color={'#17a2b8'}
              loading={this.state.loading}
            />
            </div>
          </form> 
        </div>
      );
  }
}

export default withRouter(ProfileAdd)