import React, { useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import {Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axios from 'axios';

const schema = yup.object().shape({
    edu_sc_nm:yup
      .string()
      .required(),
    edu_major: yup
      .string()
      .required(),
    edu_gd_ck: yup
      .number()
      .integer(),
      // .required()
    // user_id : yup
    //   .string()
    //   // .number()
    //   // .integer()
  });

function Edu() {
  // let history = useHistory();
  const post = (data) => {
    axios.post(`http://localhost:5000/portfolio/edu`, data)
        .then(response => {
          console.log("response: ", response.data.result)
          }).catch(()=>{
            console.log("실패했어요.")
          })
}
  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) => {
        values.user_id = window.user_id
        console.log("values", values);    
        alert(JSON.stringify(values, null, 2));
        post(values);
      }}
      initialValues={{
        edu_sc_nm: '',
        edu_major: '',
        edu_gd_ck: '',
        user_id: ''
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          user_id :{window.user_id}
          <h3>학력</h3>
          <Form.Row>
              {/* 학교이름*/}
            <Form.Group>
              <Form.Label >학교이름</Form.Label>

              <Col>
                <InputGroup hasValidation>
                    <Form.Control
                        type="text"
                        name="edu_sc_nm"
                        value={values.edu_sc_nm}
                        onChange={handleChange}
                        />
                </InputGroup>
              </Col>
              <ErrorMessage name="edu_sc_nm" component="p" />
            </Form.Group>

            {/* 전공  */}
            <Form.Group>
              <Form.Label>전공</Form.Label>
              <Form.Control
                type="text"
                name="edu_major"
                value={values.edu_major}
                onChange={handleChange}
                />
              <ErrorMessage name="edu_major" component="p" />
            </Form.Group>

            {/* 상태 */}
            <fieldset>
                <Form.Group  as={Row}>
                <Col sm={10}>
                    <Form.Check
                    type="radio"
                    inline
                    label="재학중"
                    value="1"
                    name="formHorizontalRadios"
                    />
                    <Form.Check
                    type="radio"
                    inline
                    label="학사졸업"
                    value="2"
                    name="formHorizontalRadios"
                    />
                    <Form.Check
                    type="radio"
                    inline
                    label="석사졸업"
                    value="3"
                    name="formHorizontalRadios"
                    />
                    <Form.Check
                    type="radio"
                    inline
                    label="박사졸업"
                    value="4"
                    name="formHorizontalRadios"
                    />
                </Col>
                <ErrorMessage name="edu_gd_ck" component="p" />
                </Form.Group>
            </fieldset>
          </Form.Row>
          <Button inline type="submit">확인</Button>
          <Button inline >취소</Button>
        </Form>
      )}
    </Formik>
  );
}

export default Edu;