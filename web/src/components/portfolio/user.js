import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'

import axios from 'axios';

import Edu from './edu';
import Awards from './awards';
import Project from './project';
import License from './license';
import Profile from '../profile/profile';

import { StateContext } from "../../App";
import { Container, Row, Spinner } from "react-bootstrap";


function User() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState();

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

    setSelectedId(Number(id[0]));

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
            {
              loginUserId => (
                <div>
                  <Profile loginUserId={id[0]} isEditable={selectedId == loginUserId} />
                  <Edu loginUserId={id[0]} isEditable={selectedId == loginUserId} />
                  <Awards loginUserId={id[0]} isEditable={selectedId == loginUserId} />
                  <Project loginUserId={id[0]} isEditable={selectedId == loginUserId} />
                  <License loginUserId={id[0]} isEditable={selectedId == loginUserId} />
                </div>
              )
            }
          </StateContext.Consumer>
        )}
    </Container>
  );
}

export default User;