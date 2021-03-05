import React, { useEffect, useState, useContext } from 'react';
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
import { yupResolver } from '@hookform/resolvers/yup';



import * as yup from 'yup'
import axios from 'axios';
import { StateContext } from "../../App";
import './edu.css';

const EduSchema = yup.object().shape({
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
  /* useState */
  const history = useHistory();
  const [edu, setEdu] = useState([]);
  const [form, setForm] = useState(false);
  const [userid, setUserid] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const { control, handleSubmit, errors } = useForm({ resolver: yupResolver(EduSchema) });

  const state = useContext(StateContext);
  console.log(state)

  /* jwt token setting */
  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  useEffect(() => {
    axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
      .then(response => {

        getEduList(response.data.logged_in_as);
        setUserid(response.data.logged_in_as);
        setIsLogin(true);

      }).catch((error) => {
        alert('로그인 후 이용해주세요.');
        history.push('/login');
        return;
      })
  }, [])

  /* edu get */
  const getEduList = (data) => {
    axios.get(`http://${window.location.hostname}:5000/edu/?user_id=${data}`, {})
      .then(response => {
        console.log(response);
        setEdu(response.data.result);
      })
  }

  /* edu post */
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

  /* 학력 form 제출 */
  const onSubmit = (data) => {
    console.log('data', data);
    alert(JSON.stringify(data, null, 2));
    postEdu(data);
  };

  /* react-hook-form theme 생성 */
  const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  return (
    <div>
      {/* <OutlinedCard/> */}
      {isLogin ? <div>
        <label><h3>학력</h3></label>
        <br />
        {
          edu.map((data) => (
            <EduList key={data.id} data={data} />
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
                  <label><h5>학교</h5></label>
                  <Controller placeholder="학교" as={TextField} name="edu_sc_nm" control={control} fullWidth defaultValue="" />
                  {errors.edu_sc_nm && <p>학교이름을 입력해주세요.</p>}
                </section>
                <section>
                  <label><h5>전공</h5></label>
                  <Controller placeholder="전공" as={TextField} name="edu_major" control={control} fullWidth defaultValue="" />
                  {errors.edu_major && <p>전공을 입력해주세요.</p>}
                </section>
                <section>
                  <Controller
                    as={
                      <RadioGroup row aria-label="position" name="edu_gd_ck">
                        <FormControlLabel value="1" control={<Radio />} label="재학중" />
                        <FormControlLabel value="2" control={<Radio />} label="학사졸업" />
                        <FormControlLabel value="3" control={<Radio />} label="석사졸업" />
                        <FormControlLabel value="4" control={<Radio />} label="박사졸업" />
                      </RadioGroup>
                    }
                    name="edu_gd_ck"
                    control={control}
                    defaultValue=""
                  />
                  {errors.edu_gd_ck && <p>상태를 선택해주세요.</p>}
                </section>
                <input className="eduSubmit" type="submit" />
              </form>
            </div>
          </ThemeProvider>
        }
      </div> : <div></div>}
    </div>
  );
}

function EduList(props) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (props.data.edu_gd_ck == '1') {
      setStatus('재학중');
    } else if (props.data.edu_gd_ck == '2') {
      setStatus('학사졸업');
    } else if (props.data.edu_gd_ck == '3') {
      setStatus('석사졸업');
    } else {
      setStatus('박사졸업');
    }
  }, [])

  return (
    <div key={props.data.key}>
      <label><h5>학교 및 전공</h5></label>
      <span className='mgl30'> : {props.data.edu_sc_nm} / {props.data.edu_major}</span>
      <label><h5>상태</h5></label>
      <span className='mgl30'> - {status}</span>
      <hr></hr>
    </div>
  )
}

export default Edu;

