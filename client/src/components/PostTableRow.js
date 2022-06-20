import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
export default class PostTableRow extends Component {

    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this);
    }
    deletePost() {
        axios.delete('http://localhost:4000/posts/delete-post/' + this.props.obj._id)
            .then((res) => {
                console.log('Post successfully deleted!')
            }).catch((error) => {
                console.log(error)
            })
            window.location.reload()
    }

    render() {
        const descstyle = {
            overflow: "auto",
            maxWidth: 200,
            lineBreak: "normal"
        }
        return (
            <tr>
                <td><Image onClick={() => window.open(this.props.obj.img, "_blank")} width="150" fluid src={this.props.obj.img} alt="" /></td>
                <td style={descstyle}>{this.props.obj.title}</td>
                <td style={descstyle}>{this.props.obj.description}</td>
                <td>
                    <Link className="edit-link" to={"/edit-post/" + this.props.obj._id}>
                        Edit
                    </Link>
                    
                </td>
                <td>
                    <Button onClick={this.deletePost} size="sm" variant="danger">Delete</Button>
                </td>
            </tr>
        );
    }
}