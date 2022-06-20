import React, {useState, useEffect } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CreatePost from './components/create-post.component'
import EditPost from './components/edit-post.component'
import ListPost from './components/list-post.component'
import Register from './components/auth/Register'
import Account from './components/account.component'
import Login from './components/auth/Login'
import axios from 'axios';
import UserContext from './components/context/userContext';


function App() {
  const [ userData, setUserData] = useState({
      token: undefined,
      user: undefined
    });
    useEffect(() => {
      const checkLoggedIn = async () => {
        let token = localStorage.getItem("token");
        if(token === null){
          localStorage.setItem("token", "");
          token = "";
        }
        const tokenResponse = await axios.post('http://localhost:4000/users/tokenIsValid', null, {headers: {"token": token}});
        //console.log(tokenResponse)
        if (tokenResponse.data) {
          const userRes = await axios.get("http://localhost:4000/users/", {
          headers: { "token": token 
            },
            
          });
        setUserData({
          token,
          user: userRes.data,
        });
        }
      }
      checkLoggedIn();
    }, []);
  const handleLogout = () => {
      localStorage.removeItem("token")
      window.location.reload()
  }
  return (
    <div className="App">
      <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <header className="App-header">
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand>
                {!userData.user && <Link to={'/register'} className="nav-link">
                  Zarejestruj
                </Link>}
                {!userData.user && <Link to={'/login'} className="nav-link">
                  Zaloguj
                </Link>}
                {userData.user ? <div className="text-light">Witaj {userData.user.displayName}! </div> : <div></div>}
                
              </Navbar.Brand>
              <Nav className="justify-content-end">
                  <Nav>
                    {userData.user && <Link to={'/account'} className="nav-link">
                    Konto
                  </Link>}
                </Nav>
                <Nav>
                  {userData.user && <Link to={'/login'} className="nav-link"  onClick={handleLogout}>
                    Wyloguj się
                  </Link>}
                </Nav>
                <Nav>
                  {userData.user && <Link to={'/create-post'} className="nav-link">
                    Dodaj zdjęcie
                  </Link>}
                </Nav>
                <Nav>
                  {userData.user && <Link to={'/list-post'} className="nav-link">
                    Pokaż zdjęcia
                  </Link>}
                </Nav>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <Container>
          <Row>
            <Col md={12}>
              <div className="wrapper">
                <Switch>
                  {!userData.user && <Route
                    exact
                    path="/register"
                    component={(props) => <Register {...props} />}
                  />}
                  {userData.user && <Route
                    exact
                    path="/"
                    component={(props) => <CreatePost {...props} />}
                  />}
                  {!userData.user && <Route
                    exact
                    path="/"
                    component={(props) => <Login {...props} />}
                  />}
                  {!userData.user && <Route
                    exact
                    path="/login"
                    component={(props) => <Login {...props} />}
                  />}
                  {userData.user && <Route
                    exact
                    path="/create-post"
                    component={(props) => <CreatePost {...props} />}
                  />}
                  {userData.user && <Route
                    exact
                    path="/edit-post/:id"
                    component={(props) => <EditPost {...props} />}
                  />}
                  {userData.user && <Route
                    exact
                    path="/list-post"
                    component={(props) => <ListPost {...props} />}
                  />}
                  {userData.user && <Route
                    exact
                    path="/account"
                    component={(props) => <Account {...props} />}
                  />}
                  
                </Switch>
              </div>
            </Col>
          </Row>
        </Container>
        </UserContext.Provider>
      </Router>
    </div>
  )
}
export default App