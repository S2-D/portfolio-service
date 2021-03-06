import React, { useEffect, useState } from "react";
import axios from 'axios';
import {  Nav, Navbar, } from 'react-bootstrap';
import { Link,  useHistory, } from 'react-router-dom'
import {StateContext} from '../../App'


function Header({userid, setLoginUserId}){
    const [isLogin, setIsLogin] = useState(false);
    const [url, setUrl] = useState('/user');
    let history = useHistory();

    useEffect(()=>{
      userid == '' ? setIsLogin(false) : setIsLogin(true);
      setUrl(`/user/${userid}`);
      
    },[userid])
    

    return(
        <Navbar className="" bg="dark" variant="dark">
          <Navbar.Brand href=''>RacerIn ๐ </Navbar.Brand>
          <Nav className="ml-auto">
            {
              !isLogin && (
                <Nav.Link as={Link} to="/login">๋ก๊ทธ์ธ</Nav.Link>
              )
            }
            {
              isLogin && (<Nav.Link as={Link} to={url}>๋ด์ ๋ณด</Nav.Link>)
            }
            <Nav.Link as={Link} to="/network">๋คํธ์ํฌ</Nav.Link>
            {
              isLogin && (
                <Nav.Link onClick={() => {
                  if (window.confirm('๋ก๊ทธ์์ ํ์๊ฒ ์ต๋๊น?')) {
                    axios.get(`http://${window.location.hostname}:5000/auth/logout`)
                      .then(response => {
                        if (response.data.status === "success") {
                          localStorage.setItem('access_token', '');
                          setLoginUserId('');
                          history.push('/login')
                        }
                      })
                  }
                }}>๋ก๊ทธ์์</Nav.Link>
              ) 
            }
            
          </Nav>
        </Navbar>
    );
}

export default Header;