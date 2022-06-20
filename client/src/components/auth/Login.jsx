import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/userContext";
import ErrorNotice from "../misc/ErrorNotice";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
function Login () {
const [email, setEmail] = useState();
const [password, setPassword] = useState();
const [error, setError] = useState();
const { setUserData } = useContext(UserContext);
const history = useHistory();
const submit = async (e) => {
    e.preventDefault();
    try{
        const loginUser = {email, password};
        const loginResponse = await axios.post("http://localhost:4000/users/login", loginUser);
        setUserData({
            token: loginResponse.data.token,
            user: loginResponse.data.user
        });
        localStorage.setItem("token", loginResponse.data.token);
        history.push("/");
    } catch(err) {
        err.response.data.msg && setError(err.response.data.msg)
    }
    };
    return (
        <div className="form-wrapper">
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            <Form onSubmit={submit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Hasło</Form.Label>
                    <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="danger" size="lg" block="block" type="submit" className="mt-4">
                    Zaloguj
                </Button>
        </Form>
        </div>
    );
}
export default Login;