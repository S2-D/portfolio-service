import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axios from 'axios';


const schema = yup.object().shape({
  email: yup
    .string()
    .required("아이디를 입력해주세요"),
  password: yup
    .string()
    // .min(8, '8자리 이상으로 만들어주세요')
    // .max(16)
    // .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]$")
    .required("비밀번호를 입력해주세요")
});


function Login() {
  let history = useHistory();
  const post = (data) => {
    axios.post(`http://${window.location.hostname}:5000/auth/login`, data)
      .then(response => {
        // console.log(response.data.result.access_token)
        if (response.data.status === "success") {
          const access_token = response.data.result.access_token;
          localStorage.setItem('access_token', access_token);

          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          history.push('/')
        } else {
          history.push('/login')
        }

      })
  }
  return (
    <Formik
      validationSchema={schema}
      onSubmit={values => {
        post(values);
      }}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>아이디</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" value={values.email} onChange={handleChange} />
            <Form.Text className="text-muted">
              <ErrorMessage name="email" component="p" />
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control type="password" placeholder="Password" name="password" value={values.password} onChange={handleChange} />
            <Form.Text className="text-muted">
              <ErrorMessage name="password" component="p" />
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">로그인</Button>
          <Link className="link" to="/signup">회원가입하기</Link>
        </Form>
      )}
    </Formik>
  );
}

export default Login;