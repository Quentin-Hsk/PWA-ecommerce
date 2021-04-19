import React, { FunctionComponent, memo, useState } from "react"
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Cookies from "js-cookie";
import { useToasts } from "react-toast-notifications";
import FacebookLogin from "react-facebook-login";
import { useHistory } from "react-router-dom";
import { loginUser } from "../../services/api";

const ColoredLine = () => (
    <hr style={{
        marginLeft: '5rem',
        marginRight: '5rem',
        color: 'grey',
        height: 1
    }} />
);

interface IProps {
    match: {
        params: {
            id: string
        }
    }
}

const SignIn: FunctionComponent<IProps> = ({ match }) => {
    const [inputs, setInputs] = useState();
    const history = useHistory();
    const { addToast } = useToasts()

    const handleChange = (e: any, field: string) => {
        setInputs({ ...inputs, [field]: e.target.value });
    }

    const responseFacebook = async (response: any) => {
        const body = {
            mail: response.email,
            password: response.userID,
        }
        const res = await loginUser(body);

        if (res) {
            Cookies.set('id', res.data._id);
            Cookies.set('token', res.token);
            addToast("Welcome back " + res.data.alias, {
                appearance: 'success',
                autoDismiss: true,
            });
            history.push("/");
        } else {
            addToast("Error", { appearance: 'error', autoDismiss: true })
        }
    }

    const logUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = {
            mail: inputs.mail,
            password: inputs.password,
        }
        try {
            const response = await loginUser(body);

            if (response) {
                Cookies.set('id', response.data._id);
                Cookies.set('token', response.token);
                addToast("Welcome back " + response.data.alias, {
                    appearance: 'success',
                    autoDismiss: true,
                });
                history.push("/");
            } else {
                addToast("Wrong password or email", { appearance: 'error', autoDismiss: true });
            }
        } catch (e) {
            addToast("Oops an error occured", { appearance: 'error', autoDismiss: true });
        }
    }

    return (
        <div>
            <img src={require("../../resources/pictureBackground2.jpeg")} id={"bg"} alt={""}></img>
            <Row className="justify-content-md-center">
                <Card style={{ top: '5rem', width: '30rem' }} border="dark" className="text-center p-3">
                    <Card.Body>
                        <Card.Title>Ugram</Card.Title>
                        <Row className="justify-content-md-center">
                            <form className="formCenter" onSubmit={(e) => logUser(e)}>
                                <Form.Group as={Row} controlId="formBasicEmail">
                                    <Col md="auto">
                                        <input className="form-control" placeholder={"Email"} type="email"
                                            onChange={(e) => handleChange(e, "mail")} required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Col md="auto">
                                        <input className="form-control" placeholder={"Password"} type="password"
                                            onChange={(e) => handleChange(e, "password")} />
                                    </Col>
                                </Form.Group>
                                <Button variant="primary" type={"submit"}>Login</Button>
                            </form>
                        </Row>
                    </Card.Body>
                    <FacebookLogin
                        appId="344610126475304"
                        fields="name,email,picture"
                        icon="fa-facebook"
                        isMobile={false}
                        callback={responseFacebook}
                    />
                    <ColoredLine />
                    <Card.Body>
                        <Card.Text>
                            You don't have an account? <a href={"/login/signup"}> Sign UP</a>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Row>
        </div>
    )
}

export default memo(SignIn);