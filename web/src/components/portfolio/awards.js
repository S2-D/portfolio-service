import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup'
import axios from 'axios';

import './edu.css';

const AwardsSchema = yup.object().shape({
  awards_nm: yup
    .string()
    .required(),
  awards_desc: yup
    .string()
    .required(),
  user_id: yup
    .string()
  // .number()
  // .integer()
});

function Awards() {
  const { register, control, handleSubmit, errors } = useForm({ resolver: yupResolver(AwardsSchema) });
  const onSubmit = (data) => {
    console.log('data', data);
    alert(JSON.stringify(data, null, 2));
    postAwards(data);
  };

  const [form, setForm] = useState(false);
  const [awards, setAwards] = useState([]);
  const [userid, setUserid] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  // const access_token = localStorage.getItem('access_token');
  // axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  let history = useHistory();


  useEffect(() =>
    axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
      .then(response => {

        getAwardsList(response.data.logged_in_as);
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

  const postAwards = (data) => {
    data.user_id = userid;
    axios.post(`http://${window.location.hostname}:5000/awards/`, data)
      .then(response => {
        console.log("response: ", response.data.result);
        getAwardsList(userid);
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
      {isLogin ? <div>
      <h3>수상내역</h3>
      <br />
      {
        awards.map((data) => (
          <AwardsList key={data.id} data={data} />
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
                  <label><h5>수상내역</h5></label>
                  <Controller placeholder="" as={TextField} name="awards_nm" control={control} fullWidth defaultValue="" ref={register} />
                </section>
                <section>
                  <label><h5>상세내역</h5></label>
                  <Controller placeholder="" as={TextField} name="awards_desc" control={control} fullWidth defaultValue="" ref={register} />
                </section>
                <input className="awardsSubmit" type="submit"/>
              </form>
            </div>
          </ThemeProvider>
        // <Formik
        //   validationSchema={AwardsSchema}
        //   onSubmit={values => {
        //     values.user_id = window.user_id
        //     console.log(values);
        //     // alert(JSON.stringify(values, null, 2));
        //     postAwards(values);
        //   }}
        //   initialValues={{
        //     awards_nm: '',
        //     awards_desc: '',
        //     user_id: ''
        //   }}
        // >
        //   {({
        //     handleSubmit,
        //     handleChange,
        //     values,
        //   }) => (
        //     <Form noValidate onSubmit={handleSubmit}>
        //       {/* 수상내역 */}
        //       <Form.Group>
        //         <Form.Label>수상내역</Form.Label>
        //         <InputGroup hasValidation>
        //           <Form.Control
        //             type="text"
        //             name="awards_nm"
        //             value={values.awards_nm}
        //             onChange={handleChange}
        //           />
        //         </InputGroup>
        //         <ErrorMessage name="awards_nm" component="p" />
        //       </Form.Group>

        //       {/* 상세내역  */}
        //       <Form.Group>
        //         <Form.Label>상세내역</Form.Label>
        //         <Form.Control
        //           type="text"
        //           name="awards_desc"
        //           value={values.awards_desc}
        //           onChange={handleChange}
        //         />
        //         <ErrorMessage name="awards_desc" component="p" />
        //       </Form.Group>
        //       <Button inline type="submit">확인</Button>
        //       <Button inline >취소</Button>
        //     </Form>
        //   )}
        // </Formik>
      }
     </div> : <div></div>}
    </div>
  );
}

function AwardsList(props) {
  return (
    <div key={props.data.key}>
      <label><h5>수상내역</h5></label>
      <span className='mgl30'>{props.data.awards_nm} </span>
      <label><h5>상세</h5></label>
      <span className='mgl30'>{props.data.awards_desc}</span>
      <hr />
    </div>
  )
}

export default Awards;