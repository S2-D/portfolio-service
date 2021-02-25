import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './signup';
import Login from './login';


import {Link, Route, Switch} from 'react-router-dom'
import React, { useState } from 'react';
import { Row, Container, Col, Form, Nav, Navbar, Button } from 'react-bootstrap';
import axios from 'axios';


function App() {

  let url='http://localhost:5000/login'

  const[inputs, setInputs] = useState({
    email:'',
    password:'',
    confirm:'',
    username:''
  });

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


  return (
    <div>
      {/* Nav */}
      <Navbar className="" bg="dark" variant="dark">
        <Navbar.Brand href="#home">Portfolio </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="#home">메인</Nav.Link>
          <Nav.Link href="#home">네트워크</Nav.Link>
          <Nav.Link onClick={()=>{
            axios.get('http://localhost:5000/auth/logout').then(response => {
                console.log(response);
            })
          }}>로그아웃</Nav.Link>
        </Nav>
      </Navbar>
      
      <Switch>
        {/* 로그인 */}
        <Route path="/login">
          <Container>
            <Row>    
              <Col/>
              <Col xs={6} md={4} className="login-form">
                <Login/>
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


      </Switch>
    </div>
  );
}


export default App;