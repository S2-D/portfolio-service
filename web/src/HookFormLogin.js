import React from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useHistory } from 'react-router-dom'

import './HookForm.css';

export default function HookForm() {

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
    post(data);
  };

  let history = useHistory();
  const post = (data) => {
    axios.post(`http://${window.location.hostname}:5000/auth/login`, data)
      .then(response => {
        if (response.data.status === "success") {
          const access_token = response.data.result.access_token;
          localStorage.setItem('access_token', access_token);

          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          history.push('/');
        } else {
          alert(response.data.result.error);
          document.getElementById('password').focus();
        }

      })
    }

  return (
    <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
      <label>Email</label>
      <input type="email" id="email" name="email" placeholder="email" ref={register({ required: true })} />
      {errors.email && <p>email을 입력해주세요.</p>}
      <label>비밀번호</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="password"
        ref={register({ required: true, maxLength: 10 })}
      />
      {errors.password && <p>패스워드를 입력해주세요.</p>}
      <input type="submit" value="Login"/>
    </form>
  );
}