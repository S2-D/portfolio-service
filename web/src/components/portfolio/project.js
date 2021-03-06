import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory, Redirect } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Moment from 'react-moment';



const ProjectSchema = yup.object().shape({
  project_nm: yup
    .string()
    .required(),
  project_desc: yup
    .string()
    .required(),
  project_st: yup
    .date()
  // .required()
  ,
  project_et: yup
    .date()
  // .required()
});

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function Project() {
  const { register, control, handleSubmit, errors } = useForm({ resolver: yupResolver(ProjectSchema) });

  const onSubmit = (data) => {
    console.log('data', data);
    alert(JSON.stringify(data, null, 2));
    postProject(data);
  };
  const classes = useStyles();

  const [form, setForm] = useState(false);
  const [project, setProject] = useState([]);
  const [userid, setUserid] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  const history = useHistory();

  useEffect(() => {
    axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
      .then(response => {

        getProjectList(response.data.logged_in_as);
        setUserid(response.data.logged_in_as);
        setIsLogin(true);

      }).catch((error) => {
        alert('로그인 후 이용해주세요.');
        history.push('/login');
        return;
      })
  }, [])

  const getProjectList = (data) => {
    axios.get(`http://${window.location.hostname}:5000/project/?user_id=${data}`, {})
      .then(response => {
        setProject(response.data.result)
      })
  }

  const postProject = (data) => {
    data.user_id = userid;
    axios.post(`http://${window.location.hostname}:5000/project/`, data)
      .then(response => {
        console.log("response: ", response.data.result);
        getProjectList(userid);
      }).catch(() => {
        console.log("fail")
      })
  }
  const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  return (
    <div>
      {/* <MomentDateChage /> */}
      {isLogin && <div>
        <h3>프로젝트</h3>
        <br />
                
        {
          project.map((data) => (
            <ProjectList key={data.id} data={data} />
          ))
        }
        <Button onClick={() => { setForm(!form) }}>
          {
            form
              ? '닫기'
              : '작성하기'
          }
        </Button>
        {
          form
          &&
          <ThemeProvider theme={theme}>
            <div className="container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <section>
                  <label><h5>프로젝트명</h5></label>
                  <Controller placeholder="" as={TextField} name="project_nm" control={control} fullWidth defaultValue="" ref={register} />
                </section>
                <section>
                  <label><h5>프로젝트 상세</h5></label>
                  <Controller placeholder="" as={TextField} name="project_desc" control={control} fullWidth defaultValue="" ref={register} />
                </section>
                <section>
                  <label><h5>시작일</h5></label>
                  <form className={classes.container} noValidate ref={register} >
                    <TextField
                      id="date"
                      type="date"
                      name="project_st"
                      defaultValue="2021-03-24"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </form>
                </section>
                <section>
                  <label><h5>종료일</h5></label>
                  <form className={classes.container} noValidate ref={register} >
                    <TextField
                      id="date"
                      type="date"
                      name="project_et"
                      defaultValue="2021-03-24"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </form>
                </section>
                <input className="projectSubmit" type="submit" />
              </form>
            </div>
          </ThemeProvider>
        }
      </div>}
    </div>
  );
}

function ProjectList(props) {
  return (
    <div key={props.data.key}>
      <label><h5>프로젝트명</h5></label>
      <span className='mgl30'>{props.data.project_nm} </span>
      <label><h5>프로젝트 상세</h5></label>
      <span className='mgl30'>{props.data.project_desc}</span>
      <label><h5>프로젝트 기간</h5></label>
      <span className='mgl30'> : <Moment format="YYYY.MM.DD" date={props.data.project_st}/> - <Moment format="YYYY.MM.DD" date={props.data.project_et}/></span>
      
      <hr />
    </div>
  )
}

export default Project;
