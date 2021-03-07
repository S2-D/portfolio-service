import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'


const LicenseSchema = yup.object().shape({
  license_nm: yup
    .string()
    .required(),
  license_get_date: yup
    .date()
  ,
  license_issuing_org: yup
    .string()
    .required()
});

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const getFormatDate = (date) => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth());
  month = month >= 10 ? month : '0' + month;
  let day = date.getDate();
  day = day >= 10 ? day : '0' + day;
  return year + '-' + month + '-' + day;
}


function License({ loginUserId, isEditable }) {
  /* useState */
  const [license, setLicense] = useState([]);
  const [form, setForm] = useState(false);
  const [date, setDate] = useState();
  const classes = useStyles();

  const { register, control, handleSubmit, errors } = useForm({ resolver: yupResolver(LicenseSchema) });

  /* access_token 조회 */
  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  useEffect(() => {
    console.log(isEditable);
    if (loginUserId != '') {
      console.log('loginUserId', loginUserId);
      getLicenseList(loginUserId);
    }
  }, [loginUserId])

  /* license get */
  const getLicenseList = (data) => {
    axios.get(`http://${window.location.hostname}:5000/license/?user_id=${data}`, {})
      .then(response => {
        console.log(response)

        for (let i in response.data.result) {
          const license_get_date = new Date(response.data.result[i].license_get_date);

          response.data.result[i].license_get_date = getFormatDate(license_get_date);
        }

        setLicense(response.data.result)
      })
  }

  /* license post */
  const postLicense = (data) => {
    data.user_id = loginUserId;
    axios.post(`http://${window.location.hostname}:5000/license/`, data)
      .then(response => {
        console.log("response: ", response.data.result)
        getLicenseList(loginUserId);
      }).catch(() => {
        console.log("fail")
      })
  }

  // 자격증 form 제출
  const onSubmit = (data) => {
    data.license_get_date = date;
    console.log('data', data);
    // alert(JSON.stringify(data, null, 2));
    postLicense(data);
  };

  /* react-hook-form theme 생성 */
  const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  const handleChangeDate = (e) => {
    console.log(e.target.value)
    setDate(e.target.value);
  };

  return (
    <div className='borderDiv'>
      <div>
        <h3>자격증</h3>
        <br />
        {
          license.map((data) => (
            <LicenseList key={data.id} data={data} loginUserId={loginUserId} isEditable={isEditable} />
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
                  <label><h5>자격증</h5></label>
                  <Controller placeholder="" as={TextField} name="license_nm" control={control} fullWidth defaultValue="" />
                  {errors.license_nm && <p>자격증 이름을 입력해주세요.</p>}
                </section>
                <section>
                  <label><h5>발급기관</h5></label>
                  <Controller placeholder="" as={TextField} name="license_issuing_org" control={control} fullWidth defaultValue="" />
                  {errors.license_issuing_org && <p>발급기관을 입력해주세요.</p>}
                </section>
                <section>
                  <label><h5>발급일</h5></label>
                  <TextField
                    id="date"
                    type="date"
                    name="license_get_date"
                    defaultValue=""
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChangeDate}
                  />
                </section>
                <input className="licenseSubmit" type="submit" />
              </form>
            </div>
          </ThemeProvider>
        }
      </div>
    </div>
  );
}

function LicenseList(props) {
  const { control, handleSubmit, errors } = useForm({ resolver: yupResolver(LicenseSchema) });
  const [isClicked, setIsClicked] = useState(false);
  const [date, setDate] = useState();
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  useEffect(() => {
    setDate(props.data.license_get_date);
  }, []);


  const onClickModify = (e) => {
    e.preventDefault();

    if (isClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
    }
  }

  const onClickDelete = (e) => {

    console.log(e.target.dataset.id)
    const id = e.target.dataset.id;

    if (window.confirm('삭제 하시겠습니까?')) {
      axios.delete(`http://${window.location.hostname}:5000/license/?id=${id}`, {})
        .then(response => {
          //수정
          window.location.reload();

        }).catch(() => {
          console.log("fail")
        })
    }
  }


  const onSubmit = (data) => {
    data.license_get_date = date;

    console.log('data', data);
    //alert(JSON.stringify(data, null, 2));
    putLicense(data);
  };

  /* license put */
  const putLicense = (data) => {
    data.user_id = props.loginUserId;

    if (window.confirm('수정 하시겠습니까?')) {
      axios.put(`http://${window.location.hostname}:5000/license/`, data)
        .then(response => {
          setIsClicked(false);
          alert("저장되었습니다.");
        }).catch(() => {
          console.log("fail")
        })
    }
  }

  const handleChangeDate = (e) => {
    console.log(e.target.value)
    setDate(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <section>
            <label>
              <h5>자격증명</h5>
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
            <Controller disabled={isClicked ? false : true} as={TextField} name="license_nm" control={control} fullWidth defaultValue={props.data.license_nm} />
            {errors.license_nm && <p> 자격증 이름을 입력해주세요.</p>}
            </section>
            <section>
              <label><h5>발급기관</h5></label>
              <Controller disabled={isClicked ? false : true} as={TextField} name="license_issuing_org" control={control} fullWidth defaultValue={props.data.license_issuing_org} />
              {errors.license_issuing_org && <p>발급 기관을 입력해주세요.</p>}
            </section>
            <section>
              <label><h5>발급일</h5></label>
              <TextField
                id="date"
                type="date"
                name="license_get_date"
                defaultValue={props.data.license_get_date}
                className={classes.textField}
                control={control}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChangeDate}
              />
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


export default License;