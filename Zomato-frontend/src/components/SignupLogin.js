import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Modal, Nav } from "react-bootstrap";
import { BaseUrl } from '../api/index';
import {axiosInstanceWithoutToken} from '../api/axios';
import jwt_decode from 'jwt-decode';
import '../style/SignupLogin.css';

function SignupLogin() {
    const [show, setShow] = useState(false);
    const [modelTitle, setModelTitle] = useState("");
    const [param, setParam] = useState({});
    const [decodedToken, setDecodedToken] = useState();
    const navigate = useNavigate();

    const handleShow = () => setShow(true);

    function handleClose(loginOrSingup) {
        if (loginOrSingup === "login") {
            axiosInstanceWithoutToken.post(`${BaseUrl}/login`, param).then((res) => {
                console.log(res.status)
            //     if(res.status === 200){
            //         const encodedToken = res.token;
            //         sessionStorage.setItem('token', encodedToken);
            //         const decoded = jwt_decode(res.data.data.token);
            //         setDecodedToken(decoded);
            //          console.log(decoded.userDetails.userName);
            //         window.alert(`Welcome ${decoded.userDetails.userName}`)

            //     }
            //     else{
            //         window.alert('Invalid loginId or password')
            //     }
            // 
            if (res.status === 200) {
                const token = res.data.token;
                sessionStorage.setItem('token', token);
                const decoded = jwt_decode(token);
                console.log(decoded.userDetails.username);
                window.alert(`Welcome ${decoded.userDetails.username}`);
                window.location.reload();
            } else {
                window.alert('Invalid login ID or password');
            }
        



        }
            )
            setShow(false);
        } 
        else if (loginOrSingup === "signup") {
            console.log("reached");
            axiosInstanceWithoutToken.post(`${BaseUrl}/signup`, param).then((res) => {
                console.log(res.data);
            })
            setShow(false)
        } 
        else {
            setShow(false);
        }
    }

    function handleModelTitle(parameter) {
        setModelTitle(parameter);
    }

    function createPayload(event) {
        setParam({ ...param, [event.target.name]: event.target.value });
        console.log(param);
    }

    function handleLogout() {
        if(window.confirm("Want to logout for sure!")){
            // sessionStorage.clear();
            sessionStorage.removeItem('token');
            setDecodedToken({})
            setParam({});
            navigate("/");
        }        
    }

    return (
        <>
            {!sessionStorage.getItem('token') ? 
                <Nav.Link className="text loginBtn" 
                        onClick={() => 
                            {
                                handleShow();
                                handleModelTitle("login");
                                console.log("executed line 71 ")
                            }
                        }> Login 
                </Nav.Link> : 
                <Nav.Link className="text loginBtn" 
                        onClick={() => 
                            {
                                handleLogout();
                            }
                        }> Logout 
                </Nav.Link>
            }
            {!sessionStorage.getItem('token') && 
                <Button variant="outline-light" 
                        onClick={() => 
                            {
                                handleShow();
                                handleModelTitle("signup");
                            }
                        }> Create an account 
                </Button>
            }

            <Modal className="modalBox" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    {modelTitle === "login" && <Modal.Title>Login</Modal.Title>}
                    {modelTitle === "signup" && <Modal.Title>Sign Up</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3 emailContainer" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                required
                                name="username"
                                type="email"
                                placeholder="name@example.com"
                                onChange={createPayload}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 passContainer" controlId="exampleForm.ControlInput1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                name="password"
                                type="password"
                                placeholder="abc12XH55%00"
                                onChange={createPayload}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    {
                        (!sessionStorage.getItem('token') && modelTitle === "login")
                        && <Button variant="primary" onClick={() => handleClose("login")}> Login </Button>
                    }
                    {
                        modelTitle === "signup"
                        && <Button variant="primary" onClick={() => handleClose("signup")}> Sign Up </Button>
                    }
                    <Button variant="danger" onClick={handleClose}> Cancel </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SignupLogin;