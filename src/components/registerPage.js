import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkCookie } from '../utils/cookies';
import { Button, FormGroup, FormControl, ControlLabel, Alert} from "react-bootstrap";

import { registerUserAction } from '../actions/authenticationActions';

class RegisterPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      login: "",
      password: "",
      name: "",
      email: "",
      token: "",
      loading: false,
      message: '',
    };
  }  


  validateForm() {
    return (this.state.login.length > 0 && this.state.password.length > 0 && this.state.password == this.state.password_repeat) && !this.state.loading;
  }



  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }  


  onHandleRegistration = (event) => {
    event.preventDefault();

    let username = event.target.login.value;
    let login = event.target.login.value;
    let password = event.target.password.value;
    let email = event.target.email.value;



    const data = {
      username, password, email, login
    };

    console.log(data);

    this.props.dispatch(registerUserAction(data));
  }

  componentDidMount() {
    document.title = 'React Login';
  }

  render() {
    let message, isSuccess;

    var isLogged = checkCookie();

    if (this.props.response.register.hasOwnProperty('response')) {
      isSuccess = this.props.response.register.response.success;
      message = this.props.response.register.response.message;
    }
    
    return (
      <div className="wrapper d-flex align-items-center justify-content-center">
      <div class="form flex-shrink-0">
        <h3>Регистрация</h3>
        {isLogged ? <Redirect to='/dashboard' />: '' }
        <form onSubmit={this.onHandleRegistration}>
          {!isSuccess && message ? <Alert bsStyle="danger">{message}</Alert> : <Redirect to='/dashboard' />}

          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>E-mail</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              id="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup controlId="login" bsSize="large">
            <ControlLabel>Login *</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              id="login"
              value={this.state.login}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Пароль * </ControlLabel>
            <FormControl
              id="password"
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Повтор пароля *</ControlLabel>
            <FormControl
              id="password_repeat"
              value={this.state.password_repeat}
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
        </form>
      </div></div>
    )
  }
}

const mapStateToProps = (response) => ({
  response
});

export default connect(mapStateToProps)(RegisterPage);
