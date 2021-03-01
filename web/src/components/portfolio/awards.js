import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axios from 'axios';

const schema = yup.object().shape({
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
  let [form, setForm] = useState(false);
  let [awards, setAwards] = useState([]);
  let [userid, setUserid] = useState('');

  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  useEffect(() =>
    axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
      .then(response => {
        getAwardsList(response.data.logged_in_as);
        setUserid(response.data.logged_in_as);
      })
    , []);

    const getAwardsList = (data) => {
      axios.get(`http://${window.location.hostname}:5000/awards/?user_id=${data}`, {})
        .then(response => {
          setAwards(response.data.result)
          console.log("awards", awards)
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

  return (
    <div>
      <h3>수상내역</h3>
      {/* 유저아이디 : {userid} */}
      <br />
      {
        awards.map((data) => (
          <AwardsList key={data.id} awards_nm={data.awards_nm} />
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
          ? <Formik
      validationSchema={schema}
      onSubmit={values => {
        values.user_id = window.user_id
        console.log(values);
        // alert(JSON.stringify(values, null, 2));
        postAwards(values);
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
    : null
   }
  </div>
  );
}

function AwardsList(props) {
  return (
    <div key={props.key}>
      <h4>
        {props.awards_nm}
      </h4>
      <p>졸업</p>
      <hr />
    </div>
  )
}

export default Awards;