import React, { Component } from "react";
import LinkButton from './LinkButton';
import { ClipLoader } from 'react-spinners';
import {checkCookie} from '../utils/cookies';
import {withRouter} from 'react-router-dom';
import JustLink from './JustLink';
import "./profiles.css";
import { Button, FormGroup, FormControl, ControlLabel, Alert} from "react-bootstrap";

import "./ProfileAdd.css";



function resize (file, maxWidth, maxHeight, fn) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
        var dataUrl = event.target.result;

        var image = new Image();
        image.src = dataUrl;
        image.onload = function () {
            var resizedDataUrl = resizeImage(image, maxWidth, maxHeight, 0.7);
            fn(resizedDataUrl);
        };
    };
}

function resizeImage(image, maxWidth, maxHeight, quality) {
    var canvas = document.createElement('canvas');

    var width = image.width;
    var height = image.height;

    if (width > height) {
        if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
}

class ScalingUpload extends React.Component {


    constructor(props){
      super(props);
      this.state = {
        dataUrl: '',
      };    


      this._onChange = this._onChange.bind(this);
    };



    _onChange(e) {
        let files = e.target.files;
        if (!e.target.files){
          return;
        }
        let self = this;
        let maxWidth = self.props.maxWidth;
        let maxHeight = self.props.maxHeight;
        let changeEvent = self.props.onChange; 
        resize(files[0], maxWidth, maxHeight, function (resizedDataUrl) {
            if (changeEvent){
              let image = resizedDataUrl.replace("data:image/jpeg;base64,","");
              changeEvent(image);
            }
            self.setState({ dataUrl: resizedDataUrl });
        });
    }

    render() {
        return <div>
        <div class="photo">
            {this.state.dataUrl ? <div><img className="photo__img"  src={this.state.dataUrl} /></div> : <div><img className="photo__img"  src="/avatar.png" /></div>}
            <input ref="upload" type="file" accept="image/*" onChange={ this._onChange } className="photo__input" />
        </div>
        </div>            
    }
};


class ProfileAdd extends React.Component {
    
  constructor(props){
    super(props);
    this.createProfile = this.createProfile.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
    this.fetchProfiles = this.fetchProfiles.bind(this);

    this.state = {
      user: {},
      name: '',
      token: checkCookie(),
      profile_id: '',
      profiles: '',
      profile: '',
      loading: true,
      icon: '',
    };    

  };

  changeAvatar(image){
    this.setState({icon: image})
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  validateForm() {
    return (this.state.name.length > 0) && !this.state.loading;
  }


  fetchProfiles() {
    var that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/users/self/profiles?access_token=' + that.state.token).then(function (response) {
      return response.json();
    }).then(function (result) {
      localStorage.setItem('profiles', JSON.stringify(result));
      that.props.history.push('/');
    });
  }    

  createProfile = event => {
    event.preventDefault();

    var that = this;
    let data = {
      name: that.state.name,
      profile_id: this.state.profile_id,
    };

    if (this.state.icon){
      data.icon_base64 = this.state.icon;
    }
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
      
      localStorage.removeItem('videos');
      localStorage.removeItem('videos_filters');
      localStorage.removeItem('mainFilters');
      localStorage.removeItem('programs');
      localStorage.removeItem('programs_filters');
      localStorage.removeItem('channels');
      localStorage.removeItem('profiles');

      localStorage.setItem('profile', JSON.stringify(result));
      that.fetchProfiles();
      
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
            <ScalingUpload maxHeight={200} maxWidth={200} onChange={ this.changeAvatar } />       
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