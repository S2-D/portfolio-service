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
  project_nm: yup
    .string()
    .required(),
  project_desc: yup
    .string()
    .required(),
  project_st: yup
    .string()
    .required(),
  project_et: yup
    .string()
    .required(),
  user_id: yup
    .string()
  // .number()
  // .integer()
});


function Project() {
  // let history = useHistory();
  const post = (data) => {
    axios.post(`http://localhost:5000/portfolio/project`, data)
      .then(response => {
        console.log("response: ", response.data.result)
      }).catch(() => {
        console.log("fail")
      })
  }

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();


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
        project_nm: '',
        project_desc: '',
        project_st: '',
        project_et: '',
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

          <h3>프로젝트</h3>
          {/* 제목 */}
          <Form.Group>
            <Form.Label>프로젝트 제목</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="project_nm"
                value={values.project_nm}
                onChange={handleChange}
              />
            </InputGroup>
            <ErrorMessage name="project_nm" component="p" />
          </Form.Group>

          {/* 상세내역  */}
          <Form.Group>
            <Form.Label>상세내역</Form.Label>
            <Form.Control
              type="text"
              name="project_desc"
              value={values.project_desc}
              onChange={handleChange}
            />
            <ErrorMessage name="project_desc" component="p" />
          </Form.Group>

          <DatePicker
            locale={ko}	// 언어설정 기본값은 영어
            dateFormat="yyyy-MM-dd"	// 날짜 형식 설정
            className="input-datepicker"	// 클래스 명 지정 css주기 위해
            closeOnScroll={true}	// 스크롤을 움직였을 때 자동으로 닫히도록 설정 기본값 false
            placeholderText="시작일"	// placeholder
            selected={startDate}	// value
            onChange={(date) => setStartDate(date)}	// 날짜를 선택하였을 때 실행될 함수
          />
          <DatePicker
            locale={ko}
            dateFormat="yyyy-MM-dd"
            className="input-datepicker"
            closeOnScroll={true}
            placeholderText="종료일"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
          <div>
            <Button inline type="submit">확인</Button>
            <Button inline >취소</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Project;