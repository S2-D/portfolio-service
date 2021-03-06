import React, { useEffect, useState, useParams } from 'react';

import { Link, useHistory } from 'react-router-dom'
import ProfileCard from '../profile/profile';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    }
  }));

const schema = yup.object().shape({
    searchInput: yup
    .string()
    ,
  });

function Network() {
    const classes = useStyles();

    const [input, setInput] = useState('');
    const [user,setUser] = useState([]);
    const [isLogin, setIsLogin] = useState(false);

    //let { id } = useParams();

    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema)
      });
    const onSubmit = (data) => {
        console.log(data.searchInput.length); 
        if(data.searchInput.length < 2){
            alert("검색어는 최소 2글자 이상 입력해야 합니다.")
            return
        }else {
            search(data.searchInput);
        }
    };

    const access_token = localStorage.getItem('access_token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    const history = useHistory();

    useEffect(()=> {
        //로그인 여부 조회
        axios.get(`http://${window.location.hostname}:5000/auth/protected`, {})
          .then(response => {
            search();
            setIsLogin(true);
          }).catch((error) => {
            alert('로그인 후 이용해주세요.');
            history.push('/login');
            return;
          })
      },[])
      
      
    const search = (data) => {
    axios.get(`http://${window.location.hostname}:5000/network/?username=${data}`)
        .then(response => {
            console.log("response: ", response.data.result)
             setUser(response.data.result);
            //console.log("get_user",user)
        }).catch(() => {
            console.log("fail")
        })
    }

    return (
        <div>
            {isLogin && <div>
                <div className="publish">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" name="searchInput" ref={register} onChange={(e) => { setInput(e.target.value)}}/>
                    <p>{errors.searchInput?.message}</p>
                    <input type="submit" />
                </form>

                    <Grid container  justify="center" spacing={4}>

                    {
                        // user.length == 0
                        // ?<div>없음!!</div>
                        // :
                        user.map((data)=>(
                            <Grid item spacing={4}>
                            <ProfileCard selectedId={data.id} username={data.username} email={data.email}/>
                            </Grid>
                        ))                
                    }
                    </Grid>
                </div>
            </div>}
            
        </div>
    );
}


export default Network;