import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from './avatar'
import { useHistory, Route, Link } from 'react-router-dom';

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
    width: 300,
    height: 300,
    margin : 20
  },

  title: {
    fontSize: 14
  },

  pos: {
    marginBottom: 12
  },


}));


export default function ProfileCard(props) {
  const classes = useStyles();
  let history = useHistory();
  const current_user_id = props.loginUserId;
  const selectedId = props.selectedId
  
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />
        <Typography variant="h5" component="h2">
          {props.username}
        </Typography>
        <Typography className={classes.pos} >
          {props.email}
        </Typography>
        {/* <Typography variant="body2" component="p">
          한 줄 소개
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      </CardContent>
      <CardActions>
      {/* <Button onClick={()=>{ history.push({
        pathname:"/user",
        search: '?query=abc',
        state : { selectedId :selectedId }
      }) }} color="primary">포트폴리오 보기</Button> */}
      <Button onClick={()=>{ history.push(`/user/${selectedId}`) }} className="register">포트폴리오 보기</Button>
      </CardActions>
    </Card>
  );
}
