import React, { useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import {Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axios from 'axios';

const schema = yup.object().shape({
    awards_nm:yup
      .string()
      .required(),
    awards_desc: yup
      .string()
      .required(),
    user_id : yup
      .string()
      // .number()
      // .integer()
  });

function Awards() {
  let [form, setForm] = useState(false);
  let [award, setAward] = useState([]);
  let [userid, setUserid] =useState(''); 
  
  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;



  const post = (data) => {
    axios.post(`http://${window.location.hostname}:5000/portfolio/awards`, data)
      .then(response => {
        console.log("response: ", response.data.result)
      }).catch(() => {
        console.log("fail")
      })
  }
  return (
    <Formik
      validationSchema={schema}
      onSubmit={values => {
        values.user_id = window.user_id
        console.log(values);    
        alert(JSON.stringify(values, null, 2));
        post(values);
      }}
      initialValues={{
        awards_nm: '',
        awards_desc: '',
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
          <h3>수상이력</h3>
              {/* 수상내역 */}
            <Form.Group>
              <Form.Label>수상내역</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        type="text"
                        name="awards_nm"
                        value={values.awards_nm}
                        onChange={handleChange}
                    />
                </InputGroup>
              <ErrorMessage name="awards_nm" component="p" />
            </Form.Group>

            {/* 상세내역  */}
            <Form.Group>
              <Form.Label>상세내역</Form.Label>
              <Form.Control
                type="text"
                name="awards_desc"
                value={values.awards_desc}
                onChange={handleChange}
                />
              <ErrorMessage name="awards_desc" component="p" />
            </Form.Group>
          <Button inline type="submit">확인</Button>
          <Button inline >취소</Button>
        </Form>
      )}
    </Formik>
  );
}

export default Awards;