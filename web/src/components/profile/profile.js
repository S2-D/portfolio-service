import React, { useEffect, useState  } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from './avatar'
import { useHistory, Route, Link } from 'react-router-dom';

import axios from 'axios';

import {
  createMuiTheme
} from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
  },

  title: {
    fontSize: 14
  },

  pos: {
    marginBottom: 12
  },

}));


export default function Profile({loginUserId, isEditable}) {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState([]);

/* access_token 조회 */
const access_token = localStorage.getItem('access_token');
axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

useEffect(() => {
  if(loginUserId != ''){
    //console.log('loginUserId',loginUserId);
    getUserInfo(loginUserId);
  }
}, [loginUserId])

  /* edu get */
  const getUserInfo = (data) => {
    axios.get(`http://${window.location.hostname}:5000/profile/?id=${data}`, {})
      .then(response => {
        //console.log(response) 
        setUserInfo(response.data.result);
        
      })
      .catch(
        console.log("fail")
      )
  }
  
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />
          {
            userInfo.map((data) => (
              <div key={data.id}>
                <Typography variant="h5" component="h2">
                  {data.username}
                </Typography>
                <Typography className={classes.pos}>
                  {data.email}
                </Typography>
              </div>
            ))
          }
        
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  );
}
