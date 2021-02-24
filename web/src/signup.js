import React, { useState } from 'react';
import { Container, Col, Form, Button, InputGroup } from 'react-bootstrap';

import {Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axios from 'axios';


const schema = yup.object().shape({
    id:yup.string().required("아이디를 입력해주세요"),
    password: yup.string().min(8, '8자리 이상으로 만들어주세요').max(16).required("비밀번호를 입력해주세요"),
    confirm: yup.string().required("비밀번호를 확인해주세요"),
    username: yup.string().required("이름을 입력해주세요")
  });

function Signup() {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={values => {
        console.log(values);    
        alert(JSON.stringify(values, null, 2));
      }}
      initialValues={{
        id: '',
        password: '',
        confirm: '',
        username: ''
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
                name="id"
                value={values.id}
                onChange={handleChange}
                />
            </InputGroup>
            <ErrorMessage name="id" component="p" />
            </Form.Group>

            {/* 비밀번호  */}
            <Form.Group  controlId="validationFormik02">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.pasword}
                onChange={handleChange}
                />
              <ErrorMessage name="password" component="p" />
            </Form.Group>
            <Form.Group controlId="validationFormik03">
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                name="confirm"
                value={values.confirm}
                onChange={handleChange}
                />
                <ErrorMessage name="confirm" component="p" />
            </Form.Group>

            {/* 이름 */}
            <Form.Group md="4" controlId="validationFormikUsername">
              <Form.Label>이름</Form.Label>
             
                <Form.Control
                  type="text"
                  aria-describedby="inputGroupPrepend"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                />
                <ErrorMessage name="username" component="p" />

            </Form.Group>
          </Form.Row>
          <Button type="submit">회원가입</Button>
        </Form>
      )}
    </Formik>
  );
}

export default Signup;