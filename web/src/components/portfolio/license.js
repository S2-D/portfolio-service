import React, { useRef, useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

//Form
import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'

// DatePicker
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import "react-datepicker/dist/react-datepicker.css";


const schema = yup.object().shape({
  license_nm: yup
    .string()
    .required(),
  license_get_date: yup
    .date()
    .required(),
  license_issuing_org: yup
    .string()
    .required(),
  user_id: yup
    .string()
  // .number()
  // .integer()
});

function License() {
  // let history = useHistory();
  const post = (data) => {
    axios.post(`http://${window.location.hostname}:5000/portfolio/license`, data)
      .then(response => {
        console.log("response: ", response.data.result)
      }).catch(() => {
        console.log("fail")
      })
  }

  const [getDate, setGetDate] = useState();


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
        license_nm: '',
        license_get_date: '',
        license_issuing_org: '',
        user_id: ''
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <h3>자격증</h3>
          {/* 제목 */}
          <Form.Group>
            <Form.Label>자격증 이름</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="license_nm"
                value={values.license_nm}
                onChange={handleChange}
              />
            </InputGroup>
            <ErrorMessage name="license_nm" component="p" />
          </Form.Group>

          {/* 발급기관  */}
          <Form.Group>
            <Form.Label>발급기관</Form.Label>
            <Form.Control
              type="text"
              name="license_issuing_org"
              value={values.license_issuing_org}
              onChange={handleChange}
            />
            <ErrorMessage name="license_issuing_org" component="p" />
          </Form.Group>

          <Form.Group>
            <DatePicker
              locale={ko}
              name="license_get_date"
              dateFormat="yyyy-MM-dd"	
              className="input-datepicker"	
              closeOnScroll={true}	
              placeholderText="발급일"
              selected={getDate}
              onChange={(date) => setGetDate(date)}	
            />
            <ErrorMessage name="license_get_date" component="p" />
          </Form.Group>


          <div>
            <Button inline type="submit">확인</Button>
            <Button inline >취소</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default License;