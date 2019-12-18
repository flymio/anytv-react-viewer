import React, { Component } from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import { browserHistory } from 'react-router';
import LinkButton from './LinkButton';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import * as types from '../actions';

class RemoveOneDevice extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      profile: {},      
      token: checkCookie(),
      deviceID: localStorage.getItem('deviceID'),
      loading: true,
    };
    this.params = props.match.params;    
    this.fetchDevices = this.fetchDevices.bind(this);
    this.removeDevice = this.removeDevice.bind(this);
  }


  fetchDevices(){
    var that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/users/self/devices?access_token=' + that.state.token
    ).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result);
      that.setState({loading: false});
      that.setState({data: result});
    });    
  }


  removeDevice(data){
    if (window.confirm('Вы хотите удалить это устройство?')){
      var that = this;
      fetch(process.env.REACT_APP_API_URL+'/v2/users/self/devices/'+data.id+'?access_token=' + that.state.token, {
        method: 'DELETE',
        headers:{
          "Content-Type": "application/json",
        }
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        that.setState({loading: false});
        that.props.history.push('/dashboard');
      });    
    }
  }

  listDevices(){
    var that = this;
    if (types.isEmpty(this.state.data)){
      return;
    }
    console.log(this.state.data);
    return this.state.data.map(function(item,key){
        return <li  className="list-group-item"><small>{showDate(item.created_at)}</small>, {item.vendor} — {item.model}, {item.os_name} {showDate(item.login_at)} <div class="badge badge-info">{item.device_type}</div> <a href="javascript:void(0)" className="badge badge-danger" onClick={(event) => {
            that.removeDevice(item);
          }}>удалить</a></li>;
    });    
  };


  componentWillMount() {
    this.fetchDevices();
  };


  render() {

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };    

      return (
        <div>
          {this.state.deviceID ? <h1>Ваши устройства:</h1> : <h1>Вы должны удалить одно из устройств</h1>}
          <div style={style}>
          <ClipLoader
            sizeUnit={"px"}
            size={50}
            color={'#17a2b8'}
            loading={this.state.loading}
          />
        </div>
        <ul class="list-group">
          {this.listDevices()}
        </ul>
        <br/>
        <div class="alert alert-info">При нажатии на удалить устройство оно будет удалено</div>
        </div>
      );
  }
}


const showDate = (date) =>{
  if (!date){
    return "";
  }
  return date.split("T")[0];
}


export default withRouter(RemoveOneDevice);