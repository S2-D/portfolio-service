import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axios from 'axios';

const schema = yup.object().shape({
  edu_sc_nm: yup
    .string()
    .required(),
  edu_major: yup
    .string()
    .required(),
  edu_gd_ck: yup
    .number()
    .integer(),
  // .required()
  user_id: yup
    .number()
  //   // .number()
  //   // .integer()
});

function Edu() {
  let [form, setForm] = useState(false);
  let [edu, setEdu] = useState([]);
  let [userid, setUserid] =useState(''); 

  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  useEffect(()=>
    axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
    .then(response => {
      getEduList(response.data.logged_in_as);
      setUserid(response.data.logged_in_as);
    })
  ,[]);

  const getEduList = (data) => {
    axios.get(`http://${window.location.hostname}:5000/edu/?user_id=${data}`, {})
      .then(response => {
        setEdu(response.data.result)
        console.log("edu",edu)
      })
  }

  const postEdu = (data) => {
    data.user_id = userid;
    axios.post(`http://${window.location.hostname}:5000/edu/`, data)
      .then(response => {
        console.log("response: ", response.data.result);
        getEduList(userid);
      }).catch(() => {
        console.log("fail")
      })
    }

  return (
    <div>
      <h3>학력</h3>
      유저아이디 : {userid}
      <br/>
      {
        edu.map((data) =>(
          <EduList key ={data.id} edu_sc_nm={data.edu_sc_nm}/>
        ))
      }
      

      <Button onClick={() => { setForm(!form) }}>
        {
          form == true
            ? '닫기'
            : '작성하기'
        }
      </Button>
      {
        form == true
          ? <Formik
            validationSchema={schema}
            onSubmit={(values) => {
              values.user_id = window.user_id
              console.log("values", values);
              alert(JSON.stringify(values, null, 2));
              postEdu(values);
            }}
            initialValues={{
              edu_sc_nm: '',
              edu_major: '',
              edu_gd_ck: 1,
              user_id: ''
            }}
          >
            {({
              handleSubmit,
              handleChange,
              values,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                {/* 학교이름*/}
                <Form.Group>
                  <Form.Label >학교이름</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="edu_sc_nm"
                      value={values.edu_sc_nm}
                      onChange={handleChange}
                    />
                  </InputGroup>
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
                  <Form.Group as={Row}>
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
                    <ErrorMessage name="edu_gd_ck" component="p" />
                  </Form.Group>
                </fieldset>
                <Button inline type="submit">확인</Button>
              </Form>
            )}
          </Formik>
          : null
      }

    </div>
  );
}

function EduList(props){
  return (
    <div key={props.key}>
      <h4>
        {props.edu_sc_nm}
      </h4>
      <p>졸업</p>
      <hr />
    </div>
  )
}

export default Edu;

