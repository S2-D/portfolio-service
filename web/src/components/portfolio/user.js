import React, { useContext, useState, useEffect, useParams, createContext } from "react";
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom'

import axios from 'axios';

import Edu from './edu';
import Awards from './awards';
import Project from './project';
import License from './license';
import OutlinedCard from '../profile/profile';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { StateContext } from "../../App";
import { Container, Row, Spinner } from "react-bootstrap";


function User() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  
  let { id } = useParams();

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
      .then(response => {
        setIsLoading(false);

      }).catch((error) => {
        alert('로그인 후 이용해주세요.');
        history.push('/login');
        return;
      })
  }, [])


  return (
    <Container>
      {isLoading ? (
        <Row className="justify-content-md-center p-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Row>
      ) : (
          <StateContext.Consumer>
            id는{id}
            {loginUserId => (
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <OutlinedCard />
                  <Edu loginUserId={loginUserId} />
                  {/* <Awards userid={userid} isLogin={isLogin}/>
                <Project userid={userid} isLogin={isLogin}/>
                <License userid={userid} isLogin={isLogin} license={license}/> */}
                </Grid>
              </Grid>
            )}
          </StateContext.Consumer>
        )}
    </Container>
  );
}

export default User;