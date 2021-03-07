import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const ProjectSchema = yup.object().shape({
  project_nm: yup
    .string()
    .required(),
  project_desc: yup
    .string()
    .required(),
  project_st: yup
    .date()
    .required()
  ,
  project_et: yup
    .date()
    .required()
});

/* react-hook-form theme 생성 */
const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
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

function Project({ loginUserId, isEditable }) {
  const history = useHistory();
  const classes = useStyles();
  const [project, setProject] = useState([]);
  const [form, setForm] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const { register, control, handleSubmit, errors } = useForm({ resolver: yupResolver(ProjectSchema) });

  const access_token = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  useEffect(() => {
    if (loginUserId != '') {
      //console.log('loginUserId', loginUserId);
      getProjectList(loginUserId);
    }
  }, [loginUserId])

  const onSubmit = (data) => {
    data.project_st = startDate;
    data.project_et = endDate;

    //console.log('data', data);
    //alert(JSON.stringify(data, null, 2));
    postProject(data);
  };

  const getProjectList = (data) => {
    axios.get(`http://${window.location.hostname}:5000/project/?user_id=${data}`, {})
      .then(response => {

        for (let i in response.data.result) {
          const project_st = new Date(response.data.result[i].project_st);
          const project_et = new Date(response.data.result[i].project_et);

          response.data.result[i].project_st = getFormatDate(project_st);
          response.data.result[i].project_et = getFormatDate(project_et);
        }

        setProject(response.data.result);
      })
  }

  const postProject = (data) => {
    data.user_id = loginUserId;
    axios.post(`http://${window.location.hostname}:5000/project/`, data)
      .then(response => {
        //console.log("response: ", response.data.result);
        getProjectList(loginUserId);
        setForm(false);
      }).catch(() => {
        console.log("fail")
      })
  }

  const handleChangeStartDate = (e) => {
    //console.log(e.target.value)
    setStartDate(e.target.value);
  };
  const handleChangeEndDate = (e) => {
    //console.log(e.target.value)
    setEndDate(e.target.value);
  };

  return (
    <div className='borderDiv'>
      <div>
        <label><h3 className='topTitle'>프로젝트</h3></label>
        <br />
        {
          project.map((data) => (
            <ProjectList key={data.id} data={data} loginUserId={loginUserId} isEditable={isEditable} />
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
                  <label><h5>프로젝트명</h5></label>
                  <Controller placeholder="" as={TextField} name="project_nm" control={control} fullWidth defaultValue="" />
                  {errors.project_nm && <p>프로젝트 이름을 입력해주세요.</p>}
                </section>
                <section>
                  <label><h5>프로젝트 상세</h5></label>
                  <Controller placeholder="" as={TextField} name="project_desc" control={control} fullWidth defaultValue="" />
                  {errors.project_desc && <p>프로젝트 설명을 입력해주세요.</p>}
                </section>
                <section>
                  <label><h5>시작일</h5></label>
                    <TextField
                      id="date"
                      type="date"
                      name="project_st"
                      defaultValue="2021-03-08"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleChangeStartDate}
                    />
                </section>
                <section>
                  <label><h5>종료일</h5></label>
                    <TextField
                      id="date"
                      type="date"
                      name="project_et"
                      defaultValue="2021-03-08"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleChangeEndDate}
                    />
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

function ProjectList(props) {
  const { control, handleSubmit, errors } = useForm({ resolver: yupResolver(ProjectSchema) });
  const [isClicked, setIsClicked] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const classes = useStyles();

  useEffect(() => {
    setStartDate(props.data.project_st);
    setEndDate(props.data.project_et);
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
    const id = e.target.dataset.id;

    if (window.confirm('삭제 하시겠습니까?')) {
      axios.delete(`http://${window.location.hostname}:5000/project/?id=${id}`, {})
        .then(response => {
          //수정
          window.location.reload();

        }).catch(() => {
          console.log("fail")
        })
    }
  }

  const onSubmit = (data) => {
    data.project_st = startDate;
    data.project_et = endDate;

    //console.log('data', data);
    //alert(JSON.stringify(data, null, 2));
    putProject(data);
  };

  /* edu put */
  const putProject = (data) => {
    data.user_id = props.loginUserId;

    if (window.confirm('수정 하시겠습니까?')) {
      axios.put(`http://${window.location.hostname}:5000/project/`, data)
        .then(response => {
          setIsClicked(false);
          alert("저장되었습니다.");
        }).catch(() => {
          console.log("fail")
        })
    }

  }

  const handleChangeStartDate = (e) => {
    //console.log(e.target.value)
    setStartDate(e.target.value);
  };
  const handleChangeEndDate = (e) => {
    //console.log(e.target.value)
    setEndDate(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div key={props.data.key} className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <section>
            <label>
              <h5>프로젝트명</h5>
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
            <Controller className='textFont' disabled={isClicked ? false : true} placeholder="프로젝트명" as={TextField} name="project_nm" control={control} fullWidth defaultValue={props.data.project_nm} />
            {errors.project_nm && <p>프로젝트명을 입력해주세요.</p>}
          </section>
          <section>
            <label><h5>프로젝트 상세</h5></label>
            <Controller disabled={isClicked ? false : true} placeholder="프로젝트상세" as={TextField} name="project_desc" control={control} fullWidth defaultValue={props.data.project_desc} />
            {errors.project_desc && <p>프로젝트 상세를 입력해주세요.</p>}
          </section>
          <section>
            <label><h5>시작일</h5></label>
            <TextField
              id="date"
              type="date"
              name="project_st"
              defaultValue={props.data.project_st}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeStartDate}
              disabled={isClicked ? false : true}
            />
          </section>
          <section>
            <label><h5>종료일</h5></label>
            <TextField
              id="date"
              type="date"
              name="project_et"
              defaultValue={props.data.project_et}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeEndDate}
              disabled={isClicked ? false : true}
            />
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

export default Project;