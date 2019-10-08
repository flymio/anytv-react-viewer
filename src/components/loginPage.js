import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkCookie } from '../utils/cookies';
import { loginUserAction } from '../actions/authenticationActions';
import { setCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import "./loginPage.css";

import { Button, FormGroup, FormControl, ControlLabel, Alert} from "react-bootstrap";


class LoginPage extends Component {


  constructor(props) {
    super(props);

    this.state = {
      login: "",
      password: "",
      token: "",
      loading: false,
      message: '',
    };
  }  


  validateForm() {
    return (this.state.login.length > 0 && this.state.password.length > 0) && !this.state.loading;
  }


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
    document.title = 'React Login';
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
      setCookie('token', this.props.response.login.response.access_token, 1);
    }

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    return (
      <div className="Login">
        <h3>Login Page</h3>
        {isLogged ? <Redirect to='dashboard' />: '' }
        {!isSuccess ? <div>{message}</div> : <Redirect to='dashboard' />}
        <form onSubmit={this.onHandleLogin}>
          {this.state.message ? <Alert bsStyle="danger">Unable to log in with provided credentials.</Alert> : ''}
          <FormGroup controlId="login" bsSize="large">
            <ControlLabel>Login</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              id="login"
              value={this.state.login}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
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
            bsStyle="primary"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
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

const mapStateToProps = (response) => ({response});

export default connect(mapStateToProps)(LoginPage);