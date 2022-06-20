import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
export default class EditPost extends Component {
  constructor(props) {
    super(props)
    this.onChangePostTitle = this.onChangePostTitle.bind(this);
    this.onChangePostDescription = this.onChangePostDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // State
    this.state = {
      title: '',
      description: '',
      img: ''
    }
  }
  componentDidMount() {
    axios.get('http://localhost:4000/posts/edit-post/' + this.props.match.params.id)
      .then(res => {
        this.setState({
          title: res.data.title,
          description: res.data.description
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }
  onChangePostTitle(e) {
    this.setState({ title: e.target.value })
  }
  onChangePostDescription(e) {
    this.setState({ description: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()
    const postObject = {
      title: this.state.title,
      description: this.state.description
    };
    axios.put('http://localhost:4000/posts/update-post/' + this.props.match.params.id, postObject)
      .then((res) => {
        console.log(res.data)
        console.log('Pst successfully updated')
      }).catch((error) => {
        console.log(error)
      })
    // Redirect to Student List 
    this.props.history.push('/list-post')
  }

  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="Title">
          <Form.Label>Tytuł</Form.Label>
          <Form.Control type="text" value={this.state.title} onChange={this.onChangePostTitle} required/>
        </Form.Group>
        <Form.Group controlId="Description">
          <Form.Label>Opis</Form.Label>
          <Form.Control type="text" value={this.state.description} onChange={this.onChangePostDescription} required/>
        </Form.Group>
        <Button variant="danger" size="lg" block="block" type="submit">
          Zaktualizuj
        </Button>
      </Form>
    </div>);
  }
}