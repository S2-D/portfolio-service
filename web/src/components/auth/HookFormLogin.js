import react from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom'
import './HookForm.css';

function HookForm({ setLoginUserId }) {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();

  const loginFormPost = (data) => {
    axios.post(`http://${window.location.hostname}:5000/auth/login`, data)
      .then(response => {
        if (response.data.status === "success") {
          const access_token = response.data.result.access_token;
          localStorage.setItem('access_token', access_token);

          console.log('   2. 로그인 성공시 (login.js) login id => ', response.data.result.id)
          setLoginUserId(response.data.result.id);
          history.push(`/user/${response.data.result.id}`);
        } else {
          alert(response.data.result.error);
          document.getElementById('password').focus();
        }

      });
  }

  const onSubmit = data => {
    loginFormPost(data);
  };

  const onClickSignup = () => {
    history.push('/signup');
  }

  return (
    <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <label>Email</label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="email"
        defaultValue=""
        ref={register({ required: true })}
      />
      {errors.email && <p>email을 입력해주세요.</p>}

      {/* 비밀번호 */}
      <label>비밀번호</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="password"
        ref={register({ required: true, maxLength: 10 })}
      />
      {errors.password && <p>패스워드를 입력해주세요.</p>}

      {/* login button */}
      <input className='btnLogin' type="submit" value="Login" />
      <input className='btnSignup' type="button" value="회원가입" onClick={onClickSignup}/>
    </form>
  );
}

export default HookForm;