import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from './avatar'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    height: 300
  },

  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function ProfileCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />

        <Typography variant="h5" component="h2">
          USERNAME
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          developer
        </Typography>
        <Typography variant="body2" component="p">
          한 줄 소개
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
      <Button color="primary">포트폴리오 보기</Button>
      </CardActions>
    </Card>
  );
}