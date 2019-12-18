import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { checkCookie } from '../utils/cookies';
import { ClipLoader } from 'react-spinners';
import { withRouter } from 'react-router-dom';
import JustLink from './JustLink';
import LinkButton from './LinkButton';


class Persons extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      persons: '',
      token: checkCookie(),
    };    

    this.params = props.match.params;
    this.loadPersons = this.loadPersons.bind(this);
    this.showPersons = this.showPersons.bind(this);
  }


  loadPersons(){
    let that = this;
    fetch(process.env.REACT_APP_API_URL+'/v2/persons?access_token='+this.state.token, {
      method: 'GET',
      headers:{
        "Content-Type": "application/json",
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result);
      that.setState({
        persons: result,
      })
    });    

  };


  showPersons(){
    let that = this;

    return this.state.persons.map(function(item,key){
        return <div>{item.name}</div>
    });
  }

  componentWillMount() {
    this.loadPersons();
  };


  render() {
    let that = this;
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const stylePaging = { marginLeft: '420px' };
    const params = that.props.match.params;


      return (
        <div>
          <br/>
          <h1>Persons</h1>
          {this.state.persons ? this.showPersons() : ''}
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

export default withRouter(Persons);
