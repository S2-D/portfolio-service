import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './components/auth/signup';
// import Login from './components/auth/login';
// import Edu from './components/portfolio/edu';
// import Awards from './components/portfolio/awards';
// import Project from './components/portfolio/project';
// import License from './components/portfolio/license';
import Network from './components/network/network'
// import OutlinedCard from './components/profile/profile'
import TestUser from './components/portfolio/testuser';

import HookFormLogin from './HookFormLogin'


import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';



import { Link, Route, Switch, useHistory } from 'react-router-dom'

import React, { useEffect, useState, createContext } from 'react';
import { Row, Container, Col, Form, Nav, Navbar, Button } from 'react-bootstrap';
import axios from 'axios';

export const StateContext = createContext(null);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function App() {
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  return (
    <StateContext.Provider value={isLoading}>
      <div>
        {/* Nav */}
        <Navbar className="" bg="dark" variant="dark">
          <Navbar.Brand href="/">Portfolio </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/login">로그인</Nav.Link>
            <Nav.Link as={Link} to="/network">네트워크</Nav.Link>
            <Nav.Link onClick={() => {
              if (window.confirm('로그아웃 하시겠습니까?')) {
                axios.get(`http://${window.location.hostname}:5000/auth/logout`)
                  .then(response => {
                    if (response.data.status === "success") {
                      localStorage.setItem('access_token', '');
                      history.push('/login')
                    }
                  })
              }
            }}>로그아웃</Nav.Link>
          </Nav>
        </Navbar>

        <Switch>
          <Route exact path="/">
            <TestUser/>
            {/* <Grid container spacing={3}>
              <Grid item xs={4}>
              <OutlinedCard />
              </Grid>
              <Grid item xs={8}>
              <Edu />
              <Awards />
              <Project />
              <License />
              </Grid>
            </Grid> */}
            {/* <Container>
              <Col md={8} className="pf-div">
                <Edu />
              </Col>
              <Col md={8} className="pf-div">
                <Awards />
              </Col>
              <Col md={8} className="pf-div">
                <Project />
              </Col>
              <Col md={8} className="pf-div">
                <License />
              </Col>
            </Container> */}
          </Route>

          {/* 로그인 */}
          <Route path="/login">
            <Container>
              {/* <Row>
                <Col />
                <Col xs={6} className="login-form"> */}
                  {/* <Login /> */}
                  <HookFormLogin />
                {/* </Col>
                <Col />
              </Row> */}
            </Container>
          </Route>

          {/* 회원가입  */}
          <Route path="/signup">

            <Container>
              {/* <Row>
                <Col />
                <Col className="login-form" xs={6}> */}
                  <Signup />
                {/* </Col>
                <Col />
              </Row> */}
            </Container>
          </Route>

          <Route path="/network">
            <Network></Network>
          </Route>

        </Switch>
      </div>
    </StateContext.Provider >
  );
}

export default App;