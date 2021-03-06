import React, { useState } from 'react';
import { Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import {Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axios from 'axios';

const schema = yup.object().shape({
    email:yup
      .string()
      .email("이메일 형식으로 입력하세요")
      .required("아이디를 입력해주세요"),
    password: yup
      .string()
      .min(8, '8자리 이상으로 만들어주세요')
      .max(16)
      .matches("^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$","비밀번호는 영문/ 숫자/ 특수문자를 모두 포함해야 합니다.")
      .required("비밀번호를 입력해주세요")
      ,
    confirm: yup
      .string()
      .oneOf([yup.ref('password'), null],
        '비밀번호가 일치하지 않습니다.')
      .required("비밀번호를 한 번 더 입력해주세요."),

    username: yup
      .string()
      .required("이름을 입력해주세요.")
  });

function Signup() {

  let history = useHistory();
  const post = (data) => {
    axios.post(`http://${window.location.hostname}:5000/auth/signup`, data)
        .then(response => {
          console.log("response: ", response.data.result)
          if(response.data.status ==="success") {
            alert("회원가입이 완료되었습니다.");
            history.push('/login')
          } else {
            alert(response.data.result.error)
            console.log(response)
            history.push('/signup')
          }
  })
}
  return (
    <Formik
      validationSchema={schema}
      onSubmit={values => {
        console.log(values);    
        //alert(JSON.stringify(values, null, 2));
        post(values);
      }}
      initialValues={{
        email: '',
        password: '',
        confirm: '',
        username: ''
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="validationFormik01">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" value={values.email} onChange={handleChange} />
            <ErrorMessage name="email" component="p" /> 
          </Form.Group>

          <Form.Group controlId="validationFormik02">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control type="password" placeholder="Password" name="password" value={values.password} onChange={handleChange} />
            <ErrorMessage name="password" component="p" />
          </Form.Group>

          <Form.Group controlId="validationFormik03">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control type="password" placeholder="Password check" name="confirm" value={values.confirm} onChange={handleChange} />
            <ErrorMessage name="confirm" component="p" />
          </Form.Group>

          <Form.Group controlId="validationFormik04">
            <Form.Label>사용자명</Form.Label>
            <Form.Control type="text" placeholder="Enter username" name="username" value={values.username} onChange={handleChange} />
            <ErrorMessage name="username" component="p" />
          </Form.Group>

          <Button variant="primary" type="submit">
            회원가입
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default Signup;