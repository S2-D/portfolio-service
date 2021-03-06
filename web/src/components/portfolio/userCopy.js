import React, { useContext, useState, useEffect, createContext } from "react";
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


function User({loginUserId}) {
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
      selected USERID : {id[0]}
      {isLoading ? (
        <Row className="justify-content-md-center p-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Row>
      ) : (
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <OutlinedCard loginUserId={loginUserId}  />
                  <Edu loginUserId={id[0]} />
                  {/* <Awards loginUserId={id[0]}/>
                <Project loginUserId={id[0]}/>
                <License loginUserId={id[0]}/> */}
                </Grid>
              </Grid>
        )}
    </Container>
  );
}

export default User;