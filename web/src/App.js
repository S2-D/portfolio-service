import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './components/auth/signup';
import Login from './components/auth/login';
import Edu from './components/portfolio/edu';
import Awards from './components/portfolio/awards';
import Project from './components/portfolio/project';
import License from './components/portfolio/license';


import Network from './components/network/network'


import {Link, Route, Switch, useHistory} from 'react-router-dom'

import React from 'react';
import { Row, Container, Col, Form, Nav, Navbar, Button } from 'react-bootstrap';
import axios from 'axios';


function App() {
  let history = useHistory();
  return (
    <div>
      {/* Nav */}
      <Navbar className="" bg="dark" variant="dark">
        <Navbar.Brand href="#home">Portfolio </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/login">로그인</Nav.Link>
          <Nav.Link as={Link} to="/">네트워크</Nav.Link>
          <Nav.Link onClick={() => {
            axios.get('http://localhost:5000/auth/logout').then(response => {
              if (response.data.status === "success") {
                window.user_id = ''
                history.push('/login')
              }
            })
          }}>로그아웃</Nav.Link>
        </Nav>
      </Navbar>

      <Switch>
        <Route exact path="/">
          <Container>
            <Row className="portfolio-row">
              <Col md={8} className="pf-div">
                <Edu />
              </Col>
              <Col md={8} className="pf-div">
                {/* <Awards /> */}
              </Col>
              <Col md={8} className="pf-div">
                {/* <Project /> */}
              </Col>
              <Col md={8} className="pf-div">
                {/* <License /> */}
              </Col>
            </Row>
          </Container>
        </Route>

        {/* 로그인 */}
        <Route path="/login">
          <Container>
            <Row>
              <Col />
              <Col xs={6} className="login-form">
                <Login />
              </Col>
              <Col />
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

      <Route path="/network">
        <Network></Network>
      </Route>

      </Switch>
    </div>
  );
}

export default App;