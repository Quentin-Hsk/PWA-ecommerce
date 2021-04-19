import React, {FunctionComponent, memo, useState} from "react"
import {registerUser} from "../../services/api";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import FacebookLogin from 'react-facebook-login';
import "./auth.scss"
import {useToasts} from "react-toast-notifications";
import {useHistory} from "react-router-dom";
import Cookies from "js-cookie";

interface IProps {
    match: {
        params: {
            id: string
        }
    }
}

const ColoredLine = () => (
    <hr style={{
        marginLeft: '5rem',
        marginRight: '5rem',
        color: 'grey',
        height: 1
    }} />
);

const SignUp: FunctionComponent<IProps> = ({ match })=> {
    const [inputs, setInputs] = useState();
    const history = useHistory();
    const { addToast } = useToasts();

    const responseFacebook = async (response: any) => {
        console.log(response);
        const body = {
            mail: response.email,
            phone: "",
            alias: response.name,
            password: response.userID,
        }
        const res = await registerUser(body);
        console.log(res);
        if (res) {
            Cookies.set('id', res.data._id);
            Cookies.set('token', res.token);
            addToast("Welcome " + res.data.alias, {
                    appearance: 'success',
                    autoDismiss: true,
                });
            history.push("/");
        } else {
            addToast("Error", { appearance: 'error', autoDismiss: true})
        }
    }

    const addAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = {
            mail: inputs.mail,
            phone: inputs.phone,
            alias: inputs.alias,
            password: inputs.password,
        }
        console.log(body);
        const response = await registerUser(body);
        console.log(response);
        if (response) {
            Cookies.set('id', response.data._id);
            Cookies.set('token', response.token);
            addToast("Welcome" + response.data.alias, {
                    appearance: 'success',
                    autoDismiss: true,
                });
            history.push("/");
        } else {
            addToast("Oops an error occurred", { appearance: 'error', autoDismiss: true})
        }
    }

    const handleChange = (e: any, field: string) => {
        setInputs({...inputs, [field]: e.target.value});
    }

    return (
        <div className="center">
            <img src={require("../../resources/pictureBackground1.jpeg")} id={"bg"} alt={""}></img>
            <Row className="justify-content-md-center">
            <Card style={{top:'5rem', width: '30rem'}} border="dark" className="text-center p-3">
                <Card.Body>
                    <Card.Title className="mb-10 text" >Ugram</Card.Title>
                    <br/>
                    <Card.Text>Sign up to see your friends' photos and videos.</Card.Text>
                    <FacebookLogin
                        appId="344610126475304"
                        fields="name,email,picture"
                        icon="fa-facebook"
                        isMobile={false}
                        callback={responseFacebook}
                    />
                    <br/>
                    <br/>
                    <Row className="justify-content-md-center">
                    <form className="formCenter" onSubmit={(e) => addAccount(e)}>
                        <Form.Group as={Row} controlId="formBasicEmail">
                            <Col md="auto">
                                <input className="form-control" placeholder={"Email"} type="email"
                                       onChange={(e) => handleChange(e, "mail")} required/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col md="auto">
                                <input className="form-control" placeholder={"Phone Number"} type="tel"
                                       onChange={(e) => handleChange(e, "phone")}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col md="auto">
                                <input className="form-control" placeholder={"User Name"} type="text"
                                       onChange={(e) => handleChange(e, "alias")}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col md="auto">
                                <input className="form-control" placeholder={"Password"} type="password"
                                       onChange={(e) => handleChange(e, "password")}/>
                            </Col>
                        </Form.Group>
                        <br/>
                        <Button type="submit" value="Submit">Registration</Button>
                    </form>
                    </Row>
                </Card.Body>
                <ColoredLine />
                <Card.Body>
                    <Card.Text>
                        Do you have an account? <a href={"/login/signin"}>Login</a>
                    </Card.Text>
                </Card.Body>
            </Card>
            </Row>
        </div>
    )
}

export default memo(SignUp);