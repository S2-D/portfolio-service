import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axios from 'axios';


axios.create({
	baseURL : `https://test-b.com`,
    withCredentials: true
})

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
    axios.post(`http://127.0.0.1:5000/auth/login`, data, { withCreadentials: true })
      .then(response => {
        if (response.data.status === "success") {
          window.user_id = response.data.result.user_id
          history.push('/')
        } else {
          console.log(response)
          window.user_id = response.data.email
          history.push('/')
          //alert(response.data.result.error)
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
        // <Form noValidate onSubmit={handleSubmit}>
        //   <Form.Row>

        //     {/* 아이디 */}
        //     <Form.Group controlId="validationFormik01">
        //       <Form.Label>아이디</Form.Label>
        //       <InputGroup hasValidation>
        //         <InputGroup.Prepend>
        //           <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
        //         </InputGroup.Prepend>
        //         <Form.Control
        //           type="text"
        //           name="email"
        //           value={values.email}
        //           onChange={handleChange}
        //         />
        //       </InputGroup>
        //       <ErrorMessage name="email" component="p" />
        //     </Form.Group>

        //     {/* 비밀번호  */}
        //     <Form.Group controlId="validationFormik02">
        //       <Form.Label>비밀번호</Form.Label>
        //       <Form.Control
        //         type="password"
        //         name="password"
        //         value={values.pasword}
        //         onChange={handleChange}
        //       />
        //       <ErrorMessage name="password" component="p" />
        //     </Form.Group>
        //   </Form.Row>
        //   <Button className="one_btn" variant="primary" type="submit">로그인</Button>
        //   <Button className="one_btn" variant="dark" >
        //     구글계정으로 로그인
        //       </Button>
        //   <Link className="link" to="/signup">회원가입하기</Link>
        // </Form>
      )}
    </Formik>
  );
}

export default Login;