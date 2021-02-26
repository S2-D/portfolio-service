import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './components/signup';
import Login from './components/login';
import Edu from './components/edu';

import {Link, Route, Switch} from 'react-router-dom'
import React from 'react';
import { Row, Container, Col, Form, Nav, Navbar, Button } from 'react-bootstrap';
import axios from 'axios';


function App() {
  

  return (
    <div>
      {/* Nav */}
      <Navbar className="" bg="dark" variant="dark">
        <Navbar.Brand href="#home">Portfolio </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/login">로그인</Nav.Link>
          <Nav.Link as={Link} to="/">네트워크</Nav.Link>
          <Nav.Link onClick={()=>{
            axios.get('http://localhost:5000/auth/logout').then(response => {
            })
          }}>로그아웃</Nav.Link>
        </Nav>
      </Navbar>
      

      <Switch>
        <Route exact path="/">
          <Container>
            <Row className="portfolio-row">
              <Col md={4}></Col>
              <Col md={8} className="edu"><Edu /></Col>
            </Row>
          </Container>
        </Route>
        {/* 로그인 */}
        <Route path="/login">
          <Container>
            <Row>    
              <Col/>
              <Col xs={6} md={4} className="login-form">
                <Login/>
              </Col>
              <Col/>
            </Row>
          </Container>
        </Route>

        {/* 회원가입  */}
        <Route path="/signup">
        <Container>
          <Row>
            <Col/>
            <Col className="login-form" xs={8} md={5} >
            <Signup />
            </Col>
            <Col/>
          </Row>
        </Container>
      </Route>
      </Switch>
    </div>
  );
}


export default App;