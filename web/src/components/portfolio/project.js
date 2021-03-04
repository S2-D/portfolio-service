import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory, Redirect } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup'
import axios from 'axios';

// DatePicker
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import "react-datepicker/dist/react-datepicker.css";

const ProjectSchema = yup.object().shape({
  project_nm: yup
    .string()
    .required(),
  project_desc: yup
    .string()
    .required(),
  project_st: yup
    .date(),
  // .integer()
  // .required()
  project_et: yup
    .date()
  //   // .number()
  //   // .integer()
});

function Project() {
  const { register, control, handleSubmit, errors } = useForm({ resolver: yupResolver(ProjectSchema) });
  const onSubmit = (data) => {
    console.log('data', data);
    alert(JSON.stringify(data, null, 2));
    postProject(data);
  };

  const [form, setForm] = useState(false);
  const [project, setProject] = useState([]);
  const [userid, setUserid] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  let history = useHistory();

  useEffect(() => {
    axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
      .then(response => {

        getProjectList(response.data.logged_in_as);
        setUserid(response.data.logged_in_as);
        setIsLogin(true);

      }).catch((error) => {
        alert('로그인 후 이용해주세요.');
        history.push('/login');
        return;
      })
  }, [])

  const getProjectList = (data) => {
    axios.get(`http://${window.location.hostname}:5000/project/?user_id=${data}`, {})
      .then(response => {
        console.log(response)
        setProject(response.data.result)
      })
  }

  const postProject = (data) => {
    data.user_id = userid;
    axios.post(`http://${window.location.hostname}:5000/project/`, data)
      .then(response => {
        console.log("response: ", response.data.result);
        getProjectList(userid);
      }).catch(() => {
        console.log("fail")
      })
  }
    const theme = createMuiTheme({
      palette: {
        type: "dark"
      }
    });

  return (
    <div>
      {isLogin ? <div>
        <h3>프로젝트</h3>
        <br />
        {
          project.map((data) => (
            <ProjectList key={data.id} data={data} />
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
            &&
            <ThemeProvider theme={theme}>
            <div className="container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <section>
                  <label><h5>프로젝트명</h5></label>
                  <Controller placeholder="" as={TextField} name="project_nm" control={control} fullWidth defaultValue="new Date()" ref={register} />
                </section>
                <section>
                  <label><h5>프로젝트 상세</h5></label>
                  <Controller placeholder="" as={TextField} name="project_desc" control={control} fullWidth defaultValue="new Date()" ref={register} />
                </section>
                <section>
                  <label><h5>시작일</h5></label>
                  <Controller placeholder="" as={TextField} name="project_st" control={control} fullWidth defaultValue="" ref={register} />
                </section>
                <section>
                  <label>MUI Picker</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Controller
                      name="MUIPicker"
                      control={control}
                      render={({ ref, ...rest }) => (
                        <KeyboardDatePicker
                          margin="normal"
                          id="date-picker-dialog"
                          label="Date picker dialog"
                          format="MM/dd/yyyy"
                          KeyboardButtonProps={{
                            "aria-label": "change date"
                          }}
                          {...rest}
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </section>
                <section>
                  <label><h5>종료일</h5></label>
                  <Controller placeholder="" as={TextField} name="project_et" control={control} fullWidth defaultValue="" ref={register} />
                </section>
                <input className="projectSubmit" type="submit"/>
              </form>
            </div>
          </ThemeProvider>
            // <Formik
            //   validationSchema={schema} a
            //   onSubmit={(values) => {
            //     console.log("values", values);
            //     // alert(JSON.stringify(values, null, 2));
            //     postProject(values);
            //   }}
            //   initialValues={{
            //     project_nm: '',
            //     project_desc: '',
            //     project_st: '',
            //     project_et: ''
            //   }}
            // >
            //   {({
            //     handleSubmit,
            //     handleChange,
            //     values,
            //   }) => (
            //     <Form noValidate onSubmit={handleSubmit}>
            //       {/* 프로젝트명 */}
            //       <Form.Group>
            //         <Form.Label >프로젝트명</Form.Label>
            //         <InputGroup hasValidation>
            //           <Form.Control
            //             type="text"
            //             name="project_nm"
            //             value={values.project_nm}
            //             onChange={handleChange}
            //           />
            //         </InputGroup>
            //         <ErrorMessage name="project_nm" component="p" />
            //       </Form.Group>
            //       {/* 프로젝트 내용  */}
            //       <Form.Group>
            //         <Form.Label>내용</Form.Label>
            //         <Form.Control
            //           type="text"
            //           name="project_desc"
            //           value={values.project_desc}
            //           onChange={handleChange}
            //         />
            //         <ErrorMessage name="project_desc" component="p" />
            //       </Form.Group>

            //       <Form.Group>
            //         시작일{startDate}
            //         <DatePicker
            //           locale={ko}	// 언어설정 기본값은 영어
            //           dateFormat="yyyy-MM-dd"	// 날짜 형식 설정
            //           className="input-datepicker"	// 클래스 명 지정 css주기 위해
            //           closeOnScroll={true}	// 스크롤을 움직였을 때 자동으로 닫히도록 설정 기본값 false
            //           placeholderText="시작일"	// placeholder
            //           selected={startDate}	// value
            //           onChange={(date) => setStartDate(date)}	// 날짜를 선택하였을 때 실행될 함수
            //         />
                    
            //         <DatePicker
            //           locale={ko}
            //           dateFormat="yyyy-MM-dd"
            //           className="input-datepicker"
            //           closeOnScroll={true}
            //           placeholderText="종료일"
            //           selected={endDate}
            //           onChange={(date) => setEndDate(date)}
            //         />
            //       </Form.Group>
            //       <div>
            //         <Button inline type="submit">확인</Button>
            //       </div>
            //     </Form>
            //   )}
            // </Formik>
        }
      </div> : <div></div>}
    </div>
  );
}

function ProjectList(props) {
  return (
    <div key={props.data.key}>
      <label><h5>프로젝트명</h5></label>
      <span className='mgl30'>{props.data.project_nm} </span>
      <label><h5>프로젝트 상세</h5></label>
      <span className='mgl30'>{props.data.project_desc}</span>
      <label><h5>프로젝트 기간</h5></label>
      <span className='mgl30'> : {props.data.project_st} / {props.data.project_et}</span>
      <hr />
    </div>
  )
}

export default Project;

