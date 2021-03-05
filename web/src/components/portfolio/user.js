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


function User() {
    let history = useHistory();

    const [userid, setUserid] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [license, setLicense] = useState([]);

    
    const access_token = localStorage.getItem('access_token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
    useEffect(() => {
      axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
        .then(response => {
  
          getLicenseList(response.data.logged_in_as);
          setUserid(response.data.logged_in_as);
          setIsLogin(true);
  
        }).catch((error) => {
          alert('로그인 후 이용해주세요.');
          history.push('/login');
          return;
        })
    }, [])

    const getLicenseList = (data) => {
        axios.get(`http://${window.location.hostname}:5000/license/?user_id=${data}`, {})
          .then(response => {
            console.log(response)
            setLicense(response.data.result)
    
          })
      }
    
    return (
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <OutlinedCard />
            </Grid>
            <Grid item xs={8}>
                <Edu userid={userid} isLogin={isLogin}/>
                <Awards userid={userid} isLogin={isLogin}/>
                <Project userid={userid} isLogin={isLogin}/>
                <License userid={userid} isLogin={isLogin} license={license}/>
            </Grid>
        </Grid>
    );
}

export default User;