import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import PostTableRow from './PostTableRow';
import UserContext from "./context/userContext";
export default class ListPost extends Component {
  static contextType = UserContext
  constructor(props) {
    super(props)
    this.state = {
      token: localStorage.getItem("token"),
      posts: [],
    };
  }
  componentDidMount() {
    axios.get('http://localhost:4000/posts/', {headers: {
      'token': this.state.token
    }})
      .then(res => {
        this.setState({
          posts: res.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }
  DataTable() {
    return this.state.posts.map((res, i) => {
      return <PostTableRow obj={res} key={i} />;
    });
  }

  render() {
    return (<div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Zdjęcie</th>
            <th>tytuł</th>
            <th>Opis</th>
            <th>Edycja</th>
            <th>Usuń</th>
          </tr>
        </thead>
        <tbody>
          {this.DataTable()}
        </tbody>
      </Table>
    </div>);
  }
}