import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {Link, Route, Switch} from 'react-router-dom'
import React, { useState } from 'react';
import { Row, Container, Col, Form, Nav, Navbar, Button } from 'react-bootstrap';
import axios from 'axios';

function App() {
  let [pwd, setPwd] = useState();


    axios.get('http://localhost:5000/login').then((Response)=>{
        console.log(Response.data.result[0].email);
    }).catch((Error)=>{
        console.log(Error);
    })

    return (
      <div>
        {/* Nav */}
        <Navbar className="" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Portfolio </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="#home">메인</Nav.Link>
            <Nav.Link href="#features">네트워크</Nav.Link>
            <Nav.Link href="#pricing">로그아웃</Nav.Link>
          </Nav>
        </Navbar>
        

        {/* 로그인 */}
        <Route exact path="/login">
        <Container>
          <Row>    
            <Col/>
            <Col xs={6} md={4} className="login-form">
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>아이디</Form.Label>
                  <Form.Control type="email"  />
                  <Form.Text className="text-muted">
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control type="password" />
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

        {/* 회원가입*/}
        <Route path="/signup">
          <Container>
            <Row>
              <Col/>
              <Col className="login-form" xs={8} md={5} >
                <Form >
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>아이디</Form.Label>
                    <Form.Control type="email" />
                    <Form.Text className="text-muted">
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control type="password" />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>비밀번호 확인</Form.Label>
                    <Form.Control type="password" />
                  </Form.Group>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control />
                  </Form.Group>
                  <Button className="btn" variant="primary" type="submit">
                    회원가입
                  </Button>
                </Form>
              </Col>
              <Col/>
            </Row>
          </Container>
        </Route>
        

      </div>
    );
  
}


// 회원가입
{/*  */}

export default App;