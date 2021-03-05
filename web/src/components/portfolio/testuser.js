import React, { useContext, useState, useEffect, createContext } from "react";
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom'

import Edu from './edu';
import Awards from './awards';
import Project from './project';
import License from './license';
import OutlinedCard from '../profile/profile';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';


function TestUser() {
    let history = useHistory();

    const [awards, setAwards] = useState([]);
    const [userid, setUserid] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  useEffect(() =>
    axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
      .then(response => {
        getAwardsList(response.data.logged_in_as);
        // getEduList(response.data.logged_in_as);
        // getProjectList(response.data.logged_in_as);
        // getLicenseList(response.data.logged_in_as);
        setUserid(response.data.logged_in_as);
        setIsLogin(true);
      }).catch((error) => {
        alert('로그인 후 이용해주세요.');
        history.push('/login');
        return;
      })

    , []);

    const getAwardsList = (data) => {
        axios.get(`http://${window.location.hostname}:5000/awards/?user_id=${data}`, {})
          .then(response => {
            setAwards(response.data.result);
            console.log("awards", awards);
          })
      }

  return (
      <Grid container >
          {/* <Grid item xs={4}>
              <OutlinedCard />
          </Grid>
          <Grid item xs={8}>
              <Edu userid={userid} isLogin={isLogin} /> */}
              <Awards userid={userid} isLogin={isLogin} awards={awards} />
              {/* <Project userid={userid} isLogin={isLogin} />
              <License userid={userid} isLogin={isLogin} license={license} />
          </Grid> */}
      </Grid>
            // <UserCard
            //   isShown
            //   user={user}
            //   isEditable={user.id === state?.user?.id}
            //   doFetchUser={() => doFetchUser(user.id)}
            // />
            // <Educations
            //   userId={user.id}
            //   isEditable={user.id === state?.user?.id}
            // />
            // <Awards userId={user.id} isEditable={user.id === state?.user?.id} />
            // <Projects
            //   userId={user.id}
            //   isEditable={user.id === state?.user?.id}
            // />
            // <Certificates
            //   userId={user.id}
            //   isEditable={user.id === state?.user?.id}
            // />



  );
}

export default TestUser;
