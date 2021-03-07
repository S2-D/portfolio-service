/* css */
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

/* design */
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

/* component */
import Signup from './components/auth/signup';
// import User from './components/portfolio/user';
import User from './components/portfolio/user';
import Network from './components/network/network';
import Header from './components/Header/header';
import HookFormLogin from './components/auth/HookFormLogin';

import React, { useEffect, useState, createContext } from 'react';
import { Row, Container, Col, Form, Nav, Navbar, Button } from 'react-bootstrap';
import axios from 'axios';


/* context */
export const StateContext = createContext(null);


function App() {
  const history = useHistory();
  const [userid, setUserid] = useState('');

  useEffect(() => {
    console.log('App useEffect()');
    console.log('   1. app 실행 (app.js)');

    /* access_token 조회 */
    const access_token = localStorage.getItem('access_token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    /* access_token 존재하는 경우에는 */
    if (access_token != '' && access_token != null) {
      console.log('     access_token이 존재하는 경우')

      /* access_token이 유효한지 검증 >> 로그인 상태 유지 */
      axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
        .then(response => {
          console.log('         ㄴ /auth/protected 실행결과 > 로그인 ID: ', response.data.logged_in_as)
          setUserid(response.data.logged_in_as);

        }).catch((error) => {
          alert('로그인 후 이용해주세요.');
          history.push('/login');
          return;
        })
    } else {
      console.log('     access_token이 존재하지 않음 => 현재 로그아웃 상태')
    }
  }, [userid]);

  const setLoginUserId = (loginUserId) => {
    setUserid(loginUserId);
  }

  return (
    <StateContext.Provider value={userid}>
      <div>

       <Header />

        <Switch>
          <Route exact path="/">
            <Container>
              {/* <User /> */}
            </Container>

          </Route>

          {/* 로그인 */}
          <Route path="/login">
            <Container>
              <HookFormLogin setLoginUserId={setLoginUserId} />
            </Container>
          </Route>

          {/* 회원가입 */}
          <Route path="/signup">
            <Container>
              <Signup />
            </Container>
          </Route>

          {/* 네트워크 */}
          <Route path="/network">
            <Container>
              <Network />
            </Container>
          </Route>

          <Route path="/user/:id" component={User}>
            
          </Route>

        </Switch>
      </div>
    </StateContext.Provider >
  );
}

export default App;