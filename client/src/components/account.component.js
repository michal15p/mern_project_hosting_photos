import React, { Component } from "react";
import axios from 'axios';
import UserContext from "./context/userContext";
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';
import ListGroup from "react-bootstrap/ListGroup";
export default class Home extends Component {
  static contextType = UserContext
  constructor(props) {
    super(props)
    this.deleteUser = this.deleteUser.bind(this);
    this.state = {
      token: localStorage.getItem("token"),
      postCount: 0,
      user: this.context,
      email: undefined,
    };
  }
  
  deleteUser() {
    axios.delete('http://localhost:4000/users/delete/', {headers: {
      'token': this.state.token
    }})
        .then((res) => {
            console.log('User and posts successfully deleted!')
        }).catch((error) => {
            console.log(error)
        })
    localStorage.removeItem("token")
    window.location.reload()
  }

  componentDidMount() {
    axios.get('http://localhost:4000/posts/count', {headers: {
      'token': this.state.token
    }})
      .then(res => {
        this.setState({
          postCount: res.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
      axios.get('http://localhost:4000/users/email', {headers: {
        'token': this.state.token
      }})
        .then(res => {
          this.setState({
            email: res.data.email,
            id: res.data._id
          });
        })
        .catch((error) => {
          console.log(error);
        })
      this.setState({
        user: this.context
      });
  }

  render() {
    return (<div className="form-wrapper">
      <Card style={{ width: '18rem' }}>
        {this.state.user ? <Card.Header>Konto użytkownika: {this.state.user.userData.user.displayName} </Card.Header> : <Card.Header></Card.Header>}
        <ListGroup variant="flush">
            <ListGroup.Item>Ilość zdjęć: {this.state.postCount}</ListGroup.Item>
            <ListGroup.Item>Email: {this.state.email}</ListGroup.Item>
            <ListGroup.Item><Button onClick={this.deleteUser} size="sm" variant="danger">Delete</Button></ListGroup.Item>
        </ListGroup>
        </Card>
    </div>);
  }
}