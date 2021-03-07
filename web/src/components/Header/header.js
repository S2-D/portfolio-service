import React from "react";
import axios from 'axios';
import {  Nav, Navbar, } from 'react-bootstrap';
import { Link,  useHistory, } from 'react-router-dom'


function Header(){

    let history = useHistory();

    return(
        <Navbar className="" bg="dark" variant="dark">
          <Navbar.Brand href="/">Portfolio </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/login">로그인</Nav.Link>
            <Nav.Link as={Link} to="/network">네트워크</Nav.Link>
            <Nav.Link onClick={() => {
              if (window.confirm('로그아웃 하시겠습니까?')) {
                axios.get(`http://${window.location.hostname}:5000/auth/logout`)
                  .then(response => {
                    if (response.data.status === "success") {
                      localStorage.setItem('access_token', '');
                      history.push('/login')
                    }
                  })
              }
            }}>로그아웃</Nav.Link>
          </Nav>
        </Navbar>
    );
}

export default Header;