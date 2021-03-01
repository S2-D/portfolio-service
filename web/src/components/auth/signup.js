import React, { useState } from 'react';
import { Col, Form, Button, InputGroup } from 'react-bootstrap';
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
      ,
    confirm: yup
      .string()
      .required("비밀번호를 확인해주세요"),
    username: yup
      .string()
      .required("이름을 입력해주세요")
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
        // <Form noValidate onSubmit={handleSubmit}>
        //   <Form.Row>
        //       {/* 아이디 */}
        //     <Form.Group as={Col} md="4" controlId="validationFormik01">
        //       <Form.Label>아이디</Form.Label>
        //       <InputGroup hasValidation>
        //         <InputGroup.Prepend>
        //             <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
        //         </InputGroup.Prepend>
        //       <Form.Control
        //         type="text"
        //         name="email"
        //         value={values.email}
        //         onChange={handleChange}
        //         />
        //     </InputGroup>
        //     <ErrorMessage name="email" component="p" />
        //     </Form.Group>

        //     {/* 비밀번호  */}
        //     <Form.Group as={Col} md="4" controlId="validationFormik02">
        //       <Form.Label>비밀번호</Form.Label>
        //       <Form.Control
        //         type="password"
        //         name="password"
        //         value={values.pasword}
        //         onChange={handleChange}
        //         />
        //       <ErrorMessage name="password" component="p" />
        //     </Form.Group>
        //     <Form.Group as={Col} md="4" controlId="validationFormik03">
        //       <Form.Label>비밀번호 확인</Form.Label>
        //       <Form.Control
        //         type="password"
        //         name="confirm"
        //         value={values.confirm}
        //         onChange={handleChange}
        //         />
        //         <ErrorMessage name="confirm" component="p" />
        //     </Form.Group>

        //     {/* 이름 */}
        //     <Form.Group as={Col} md="4" controlId="validationFormikUsername">
        //       <Form.Label>이름</Form.Label>
             
        //         <Form.Control
        //           type="text"
        //           aria-describedby="inputGroupPrepend"
        //           name="username"
        //           value={values.username}
        //           onChange={handleChange}
        //         />
        //         <ErrorMessage name="username" component="p" />

        //     </Form.Group>
        //   </Form.Row>
        //   <Button type="submit">회원가입</Button>
        // </Form>
      )}
    </Formik>
  );
}

export default Signup;