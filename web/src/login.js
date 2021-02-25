import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import {Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axios from 'axios';

const schema = yup.object().shape({
  email:yup
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
    axios.post(`http://127.0.0.1:5000/auth/login`, data)
        .then(response => console.log("response: ", response.data.result))
}
  return (
    <Formik
      validationSchema={schema}
      onSubmit={values => {
        console.log("input", values);    
        post(values);
        history.push('/')
      }}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Row>
              {/* 아이디 */}
            <Form.Group controlId="validationFormik01">
              <Form.Label>아이디</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
                />
            </InputGroup>
            <ErrorMessage name="email" component="p" />
            </Form.Group>

            {/* 비밀번호  */}
            <Form.Group controlId="validationFormik02">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.pasword}
                onChange={handleChange}
                />
              <ErrorMessage name="password" component="p" />
            </Form.Group>
          </Form.Row>
          <Button className="btn" variant="primary" type="submit">로그인</Button>
          <Button className="btn" variant="dark" >
                구글계정으로 로그인
              </Button>
          <Link className="link" to="/signup">회원가입하기</Link>
        </Form>
      )}
    </Formik>
  );
}

export default Login;