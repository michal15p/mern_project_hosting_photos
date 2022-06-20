import React, {Component} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
export default class CreatePost extends Component {
  constructor(props) {
    super(props)
    
    this.onChangePostTitle = this.onChangePostTitle.bind(this);
    this.onChangePostDescription = this.onChangePostDescription.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
    this.state = {
      title: '',
      description: '',
      img: '',
      token: localStorage.getItem("token")
    }
  }
  
  onChangePostTitle(e) {
    this.setState({ title: e.target.value })
  }
  onChangePostDescription(e) {
    this.setState({ description: e.target.value })
  }

  onFileChange(e) {
    this.setState({ img: e.target.files[0] })
  }
  
  onSubmit(e) {
    const postObject = new FormData();
    postObject.append('title', this.state.title);
    postObject.append('description', this.state.description);
    postObject.append('img', this.state.img);
    
    
    axios.post('http://localhost:4000/posts/create-post', postObject, {headers: {
      'token':this.state.token
    }})
      .then(res => console.log(res.data));
    this.setState({ title: '', description: '', img: ''})
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
        <Form.Group controlId="Img">
          <Form.Label>Zdjęcie</Form.Label>
          <Form.Control type="file" onChange={this.onFileChange} required/>
        </Form.Group>
        <Button variant="danger" size="lg" block="block" type="submit" className="mt-4">
          Dodaj
        </Button>
      </Form>
    </div>);
  }
}