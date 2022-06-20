import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/userContext";
import ErrorNotice from "../misc/ErrorNotice";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
function Register () {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [displayName, setDisplayName] = useState();
    const [error, setError] = useState();
    const { setUserData } = useContext(UserContext);
    const history = useHistory();
    const submit = async (e) => {
    e.preventDefault();
    try{
        const newUser = {email, password, passwordCheck, displayName};
        await axios.post("http://localhost:4000/users/register", newUser);
        const loginResponse = await axios.post("http://localhost:4000/users/login", {
            email, password
    });
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
        <Form.Group controlId="Email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" onChange={e => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="Password">
          <Form.Label>Hasło</Form.Label>
          <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="Description">
          <Form.Label>Powtórz hasło</Form.Label>
          <Form.Control type="password" onChange={e => setPasswordCheck(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="Name">
          <Form.Label>Nazwa konta</Form.Label>
          <Form.Control type="text" onChange={e => setDisplayName(e.target.value)} />
        </Form.Group>
        <Button variant="danger" size="lg" block="block" type="submit" className="mt-4">
          Stwórz konto
        </Button>
      </Form>
    </div>
    );
}
export default Register;