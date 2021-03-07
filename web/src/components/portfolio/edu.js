import React, { useEffect, useState  } from 'react';
import { Button } from 'react-bootstrap';
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
    .integer()
  .required()
});

/* react-hook-form theme 생성 */
const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});


function Edu({loginUserId, isEditable}) {
  /* useState */
  const [edu, setEdu] = useState([]);
  const [form, setForm] = useState(false);

  const { control, handleSubmit, errors } = useForm({ resolver: yupResolver(EduSchema) });

  /* access_token 조회 */
  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
  useEffect(() => {
    if(loginUserId != ''){
      console.log('loginUserId',loginUserId);
      getEduList(loginUserId);
    }
  }, [loginUserId])

  /* edu get */
  const getEduList = (data) => {
    axios.get(`http://${window.location.hostname}:5000/edu/?user_id=${data}`, {})
      .then(response => {
        console.log(response) 
        setEdu(response.data.result);
      })
  }

  /* edu post */
  const postEdu = (data) => {
    data.user_id = loginUserId;
    axios.post(`http://${window.location.hostname}:5000/edu/`, data)
      .then(response => {
        console.log("response: ", response.data.result);
        getEduList(loginUserId);
      }).catch(() => {
        console.log("fail")
      })
  }

  /* 학력 form 제출 */
  const onSubmit = (data) => {
    //console.log('data', data);
    //alert(JSON.stringify(data, null, 2));
    postEdu(data);
  };

  return (
    <div className='borderDiv'>
        <label><h3>학력</h3></label>
        {
          edu.map((data) => (
            <EduList key={data.id} data={data} loginUserId={loginUserId} isEditable={isEditable}/>
          ))
        }
        <Button className='btnSubmit' onClick={() => { setForm(!form) }}>
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
    </div>
  );
}

function EduList(props) {
  const { control, handleSubmit, errors } = useForm({ resolver: yupResolver(EduSchema) });
  const [isClicked, setIsClicked] = useState(false);

  const onClickModify = (e) => {
    e.preventDefault();
    
    if(isClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
    }
  }

  const onClickDelete = (e) => {
    const id = e.target.dataset.id;

    if (window.confirm('삭제 하시겠습니까?')) {
      axios.delete(`http://${window.location.hostname}:5000/edu/?id=${id}`, {})
      .then(response => {
        //수정
        window.location.reload();

      }).catch(() => {
        console.log("fail")
      })
    }
  }

  const onSubmit = (data) => {
    //console.log('data', data);
    //alert(JSON.stringify(data, null, 2));
    putEdu(data);
  };

  /* edu put */
  const putEdu = (data) => {
    data.user_id = props.loginUserId;

    if (window.confirm('수정 하시겠습니까?')) {
      axios.put(`http://${window.location.hostname}:5000/edu/`, data)
      .then(response => {
        setIsClicked(false);
        alert("저장되었습니다.");
      }).catch(() => {
        console.log("fail")
      })
    }
    
  }

  return (
      <ThemeProvider theme={theme}>
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <section>
              <label>
                <h5>학교</h5>
                {
                  props.isEditable && (
                  <span className='floatR'>
                    {
                      isClicked ? (
                      <a href='#' onClick={onClickModify}>닫기</a>
                      ) : (
                      <a href='#' onClick={onClickModify}>수정</a>
                      )
                    }
                    &nbsp; &nbsp; <a href='#' data-id={props.data.id} onClick={onClickDelete}>삭제</a>
                  </span>
                  )
                }
              </label>
              <Controller disabled={isClicked ? false : true} placeholder="학교" as={TextField} name="edu_sc_nm" control={control} fullWidth defaultValue={props.data.edu_sc_nm} />
              {errors.edu_sc_nm && <p>학교이름을 입력해주세요.</p>}
            </section>
            <section>
              <label><h5>전공</h5></label>
              <Controller disabled={isClicked ? false : true} placeholder="전공" as={TextField} name="edu_major" control={control} fullWidth defaultValue={props.data.edu_major} />
              {errors.edu_major && <p>전공을 입력해주세요.</p>}
            </section>
            <section>
              <Controller
                as={
                    <RadioGroup row aria-label="position" name="edu_gd_ck" value={props.data.edu_gd_ck}>
                      <FormControlLabel disabled={isClicked ? false : true} value="1" control={<Radio />} label="재학중" />
                      <FormControlLabel disabled={isClicked ? false : true} value="2" control={<Radio />} label="학사졸업" />
                      <FormControlLabel disabled={isClicked ? false : true} value="3" control={<Radio />} label="석사졸업" />
                      <FormControlLabel disabled={isClicked ? false : true} value="4" control={<Radio />} label="박사졸업" />
                    </RadioGroup>
                }
                name="edu_gd_ck"
                control={control}
                defaultValue={props.data.edu_gd_ck.toString()}
              />
              {errors.edu_gd_ck && <p>상태를 선택해주세요.</p>}
            </section>
            <Controller type="hidden" as={TextField} name="id" control={control} defaultValue={props.data.id} />
            {
              isClicked && (<input className="eduSubmit" type="submit" />)
            }
          </form>
        </div>
      </ThemeProvider>
  )
}

export default Edu;

