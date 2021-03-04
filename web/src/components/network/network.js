import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import axios from 'axios';
function Network() {
    const [input, setInput] = useState('');
    const [user,setUser] = useState([]);

    const search = (data) => {
    axios.get(`http://${window.location.hostname}:5000/network?username=${data}`)
        .then(response => {
            console.log("response: ", response.data.result)
            setUser(response.data.result);
        }).catch(() => {
            console.log("fail")
        })
    }

    return (
        <div>
            <div className="publish">
                <input onChange={(e) => { setInput(e.target.value) }} placeholder="이름으로 검색" />
                <button onClick={() => {
                    search(input)
                }}>검색</button>
                {
                    // user.length == 0
                    // ?<div>없음!!</div>
                    // :
                    user.map((data)=>(
                        <NetworkCard key={data.id} username={data.username} email={data.email}/>
                    ))                
                }
               
            </div>
        </div>
    );
}

function NetworkCard(props) {
    return (
    <Card style={{ width: '18rem' }}>
    <Card.Body>
        <Card.Title>{props.username}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{props.email}</Card.Subtitle>
        <Card.Text>
        한 줄 소개
        </Card.Text>
        <Card.Link href="#">프로필 보기</Card.Link>
    </Card.Body>
</Card>)
}

export default Network;