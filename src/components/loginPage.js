import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkCookie } from '../utils/cookies';
import { loginUserAction, registerUserAction } from '../actions/authenticationActions';
import { setCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import JustLink from './JustLink';
import "./loginPage.css";

import { Button, FormGroup, FormControl, ControlLabel, Alert} from "react-bootstrap";


class LoginPage extends Component {


  constructor(props) {
    super(props);

    this.state = {
      login: "",
      password: "",
      autoreg: false,
      token: "",
      loading: false,
      message: '',
    };
  }  


  validateForm() {
    return (this.state.login.length > 0 && this.state.password.length > 0) && !this.state.loading;
  }


  handleAutoreg = event => {
    event.preventDefault();


    let username = Math.random().toString(36).slice(-8);
    let password = Math.random().toString(36).slice(-8);
    let login = username;

    const data = {
      username, password, login
    };


    this.props.dispatch(registerUserAction(data));
  };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }


  onHandleLogin = (event) => {
    event.preventDefault();

    this.setState({loading: true});
    this.setState({message: false});

    let login = event.target.login.value;
    let password = event.target.password.value;

    const data = {
      login, password
    };

    this.props.dispatch(loginUserAction(data));
  }

  componentDidMount() {
    var that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/users/self/network', {
      method: 'GET',
      headers:{
        "Content-Type": "application/json",
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {    
      console.log(result);

      if (result.is_registration_allowed){ // && result.is_autoregistration_allowed){
        that.setState({ autoreg: true});
      }
    });    
    document.title = '24h.tv Login';
  }

  render() {
    let isSuccess, message;


    var isLogged = checkCookie();

    if (this.props.response.login.hasOwnProperty('response') && this.props.response.login.response.hasOwnProperty('error') && !this.state.message) {
      this.setState({message: this.props.response.login.response.error});
      this.setState({loading: false});
    }
    if (this.props.response.login.hasOwnProperty('response') && this.props.response.login.response.hasOwnProperty('access_token')) {
      isSuccess = 1;
      message = "ok";
      setCookie('token', this.props.response.login.response.access_token, 24);
    }

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    return (
      <div className="wrapper d-flex align-items-center justify-content-center">
        <div className="form flex-shrink-0">
        <h3>Авторизация</h3>
        {isLogged ? <Redirect to='dashboard' />: '' }
        {!isSuccess ? <div>{message}</div> : <Redirect to='dashboard' />}
        <form onSubmit={this.onHandleLogin}>
          {this.state.message ? <Alert bsStyle="danger">Unable to log in with provided credentials.</Alert> : ''}
          <FormGroup controlId="login" bsSize="large">
            <ControlLabel>Логин</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              id="login"
              value={this.state.login}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Пароль</ControlLabel>
            <FormControl
              id="password"
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            bsStyle="btn form__button"
            disabled={!this.validateForm()}
            type="submit"
          >
            Войти
          </Button>
          <br/>
          <div className="form__link">Первый раз на сайте? <JustLink replaceClass="form__link-item" to="/register/">Регистрация</JustLink></div>
          <div className="form__description">С помощью этой учетной записи вы можете получить доступ к службам сайта.</div>
          <br/>
          {this.state.autoreg? <Button
            block
            bsSize="large"
            bsStyle="primary"            
            type="submit"
            onClick={this.handleAutoreg}
          >Войти без регистрации</Button> : ''}
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
      </div>
    );
  }
}

const mapStateToProps = (response) => ({response});

export default connect(mapStateToProps)(LoginPage);