import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'

import Moment from 'react-moment';

const LicenseSchema = yup.object().shape({
  license_nm: yup
    .string()
    .required(),
  license_get_date: yup
    .date()
  // .required()
  ,
  license_issuing_org: yup
    .string()
    .required()
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

function License() {
  const { register, control, handleSubmit, errors } = useForm({ resolver: yupResolver(LicenseSchema) });

  const onSubmit = (data) => {
    console.log('data', data);
    alert(JSON.stringify(data, null, 2));
    postLicense(data);
  };

  const classes = useStyles();
  const [form, setForm] = useState(false);
  const [license, setLicense] = useState([]);
  const [userid, setUserid] = useState('');
  const [isLogin, setIsLogin] = useState(false);


  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  const history = useHistory();

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


  const postLicense = (data) => {
    data.user_id = userid;
    axios.post(`http://${window.location.hostname}:5000/license`, data)
      .then(response => {
        console.log("response: ", response.data.result)
        getLicenseList(userid);
      }).catch(() => {
        console.log("fail")
      })
  }

  // const [getDate, setGetDate] = useState();
  const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  return (
    <div>
      
      {isLogin && <div>
        <h3>자격증</h3>
        <br />
        {
          license.map((data) => (
            <LicenseList key={data.id} data={data} />
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
                  <label><h5>자격증</h5></label>
                  <Controller placeholder="" as={TextField} name="license_nm" control={control} fullWidth defaultValue="" ref={register} />
                </section>
                <section>
                  <label><h5>발급기관</h5></label>
                  <Controller placeholder="" as={TextField} name="license_issuing_org" control={control} fullWidth defaultValue="" ref={register} />
                </section>
                <section>
                  <label><h5>발급일</h5></label>
                  <form className={classes.container} noValidate ref={register} >
                    <TextField
                      id="date"
                      type="date"
                      name="license_get_date"
                      defaultValue="datetime.utcnow()+timedelta(hours=9)"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </form>
                </section>
                <input className="licenseSubmit" type="submit" />
              </form>
            </div>
          </ThemeProvider>
        }
      </div>}
    </div>
  );
}

function LicenseList(props) {
  console.log(props.data.key)
  return (
    <div key={props.data.key}>
      <label><h5>자격증명</h5></label>
      <span className='mgl30'>{props.data.license_nm} </span>
      <label><h5>발급기관</h5></label>
      <span className='mgl30'>{props.data.license_issuing_org}</span>
      <label><h5>발급일</h5></label>
      <span className='mgl30'> :<Moment format="YYYY-MM-DD" date={props.data.license_get_date}/></span>
      <hr />
    </div>
  )
}


export default License;


