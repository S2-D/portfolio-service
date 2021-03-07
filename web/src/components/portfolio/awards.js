import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup'
import axios from 'axios';
import './edu.css';

const AwardsSchema = yup.object().shape({
  awards_nm: yup
    .string()
    .required(),
  awards_desc: yup
    .string()
    .required(),
});

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});


function Awards({ loginUserId, isEditable }) {
  /* useState */
  const [awards, setAwards] = useState([]);
  const [form, setForm] = useState(false);

  const { control, handleSubmit, errors } = useForm({ resolver: yupResolver(AwardsSchema) });

  /* access_token 조회 */
  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  useEffect(() => {
    if (loginUserId != '') {
      //console.log('loginUserId', loginUserId);
      getAwardsList(loginUserId);
    }
  }, [loginUserId])

  /* awards get */
  const getAwardsList = (data) => {
    axios.get(`http://${window.location.hostname}:5000/awards/?user_id=${data}`, {})
      .then(response => {
        setAwards(response.data.result);
        //console.log("awards", awards);
      })
  }

  /* awards post */
  const postAwards = (data) => {
    data.user_id = loginUserId;
    axios.post(`http://${window.location.hostname}:5000/awards/`, data)
      .then(response => {
        //console.log("response: ", response.data.result);
        getAwardsList(loginUserId);
        setForm(false);
      }).catch(() => {
        console.log("fail")
      })
  }

  /* 수상내역 form 제출 */
  const onSubmit = (data) => {
    //console.log('data', data);
    //alert(JSON.stringify(data, null, 2));
    postAwards(data);
  };


  return (
    <div className='borderDiv'>
      <div>
        <label><h3 className='topTitle'>수상내역</h3></label>
        <br />
        {
          awards.map((data) => (
            <AwardsList key={data.id} data={data} loginUserId={loginUserId} isEditable={isEditable} />
          ))
        }
        {
          isEditable && (
            <Button className='register' onClick={() => { setForm(!form) }}>
              {
                form
                  ? '닫기'
                  : '작성하기'
              }
            </Button>
          )
        }
        {
          form
          &&
          <ThemeProvider theme={theme}>
            <div className="container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <section>
                  <label><h5>수상내역</h5></label>
                  <Controller placeholder="" as={TextField} name="awards_nm" control={control} fullWidth defaultValue="" />
                  {errors.awards_nm && <p>학교이름을 입력해주세요.</p>}
                </section>
                <section>
                  <label><h5>상세내역</h5></label>
                  <Controller placeholder="" as={TextField} name="awards_desc" control={control} fullWidth defaultValue="" />
                  {errors.awards_desc && <p>전공을 입력해주세요.</p>}
                </section>
                <input className="userSubmit" type="submit" />
              </form>
            </div>
          </ThemeProvider>
        }
      </div>
    </div>
  );
}

function AwardsList(props) {
  const { control, handleSubmit, errors } = useForm({ resolver: yupResolver(AwardsSchema) });
  const [isClicked, setIsClicked] = useState(false);

  const onClickModify = (e) => {
    e.preventDefault();

    if (isClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
    }
  }

  const onClickDelete = (e) => {

    //console.log(e.target.dataset.id)
    const id = e.target.dataset.id;

    if (window.confirm('삭제 하시겠습니까?')) {
      axios.delete(`http://${window.location.hostname}:5000/awards/?id=${id}`, {})
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
    putAwards(data);
  };


  /* Awards put */
  const putAwards = (data) => {
    data.user_id = props.loginUserId;

    if (window.confirm('수정 하시겠습니까?')) {
      axios.put(`http://${window.location.hostname}:5000/awards/`, data)
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
      <div key={props.data.key} className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <section>
            <label>
              <h5>수상내역</h5>
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
            <Controller disabled={isClicked ? false : true} placeholder="수상내역" as={TextField} name="awards_nm" control={control} fullWidth defaultValue={props.data.awards_nm} />
            {errors.awards_nm && <p>수상 내역을 입력해주세요.</p>}
          </section>
          <section>
            <label><h5>상세</h5></label>
            <Controller disabled={isClicked ? false : true} placeholder="상세" as={TextField} name="awards_desc" control={control} fullWidth defaultValue={props.data.awards_desc} />
            {errors.awards_desc && <p>상세 내용을 입력해주세요.</p>}
          </section>
          <Controller type="hidden" as={TextField} name="id" control={control} defaultValue={props.data.id} />
          {
            isClicked && (<input className="userSubmit" type="submit" />)
          }
        </form>
      </div>
    </ThemeProvider>
  )
}

export default Awards;