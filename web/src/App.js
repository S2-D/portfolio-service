import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './signup';
import WithFormik from'./login';

import {Link, Route, Switch} from 'react-router-dom'
import React, { useState } from 'react';
import { Row, Container, Col, Form, Nav, Navbar, Button } from 'react-bootstrap';
import axios from 'axios';


function App() {
  let url='http://localhost:5000/login'

  const[user, setUser] = useState({});
  const[inputs, setInputs] = useState({
    email:'',
    password:'',
    confirm:'',
    username:''
  });
  const[msg, setMsg] = useState(false);


  // let [value,setValue] =useState();

  // const handleChange = (e) => {
  //   setValue(e.target.value);
  // }
  const handleSubmit = (event) => {
    console.log(inputs)
    alert('A name was submitted: ' + inputs.email);
    event.preventDefault();
  }

  const get = () =>{
    axios.get(url).then((Response)=>{
      console.log();
  }).catch((Error)=>{
      console.log(Error);
  })};

  const post = (data) => {
    axios.post('http://localhost:5000/login', data)
        .then(response => console.log(response))
  }
  
  const onChange = (e) => {
    const { value, name } = e.target;
    console.log(value, name);
    setInputs({
        ...inputs,
        [name]: value
    });
  }

  const register = () => {
    const { email, password, confirm, username } = inputs;
    
      
        if( password === confirm ) {
            setMsg(true);
            return;
        } else {
            setMsg(false);
        }

    post(inputs);
  }

  const Msg = () => {
    return (
        <span className="msg">Check your password.</span>
    );
  }


  // 

  return (
    <div>
      {/* Nav */}
      <Navbar className="" bg="dark" variant="dark">
        <Navbar.Brand href="#home">Portfolio </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="#home">메인</Nav.Link>
          <Nav.Link href="#home">네트워크</Nav.Link>
        </Nav>
      </Navbar>
    
      {/* 로그인 */}
      <Route path="/login">
      <WithFormik/>
      <Container>
        <Row>    
          <Col/>
          <Col xs={6} md={4} className="login-form">
            <Form onSubmit={handleSubmit} >
              <Form.Group controlId="formBasicEmail">
                <Form.Label>아이디</Form.Label>
                <Form.Control name='email' type="email" onChange={onChange} />
                <Form.Text className="text-muted" >
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>비밀번호</Form.Label>
                <Form.Control name='password' type="password" onChange={onChange}/>
              </Form.Group>
              <Button className="btn" variant="primary" type="submit">
                로그인
              </Button>
              <Button className="btn" variant="dark" type="submit">
                구글계정으로 로그인
              </Button>
              <Link className="link" to="/signup">회원가입하기</Link>
            </Form>
          </Col>
          <Col/>
        </Row>
      </Container>
      </Route>

      {/* 회원가입  */}
      <Route path="/signup">
        <Container>
          <Row>
            <Col/>
            <Col className="login-form" xs={8} md={5} >
            <Signup />
            </Col>
            <Col/>
          </Row>
        </Container>
      </Route>
    
    </div>
  );
}


export default App;