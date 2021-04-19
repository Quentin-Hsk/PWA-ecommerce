import React, {FunctionComponent, memo, useEffect, useState} from "react";
import "./profile.scss"
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {getUserById, updateUser} from "../../services/api";
import Loader from "../utils/loader";
import Cookies from "js-cookie";
import {useHistory} from "react-router-dom";
import {useToasts} from "react-toast-notifications";

interface IProps {
    match: {
        params: {
            id: string
        }
    }
}

const EditProfile: FunctionComponent<IProps> = ({ match })=> {

    const [inputs, setInputs] = useState();
    const history = useHistory();
    const { addToast } = useToasts()

    const changeParams = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = {
            mail: inputs.mail,
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            phone: inputs.phone,
        }
        const response = await updateUser(match.params.id, body);
        if (response) {
            addToast("Your profil has been modify", {
                appearance: 'success',
                autoDismiss: true,
            });
            history.push("/profile/" + Cookies.get("id"));
            return false;
        } else {
            addToast("Oops an error occurred", { appearance: 'error', autoDismiss: true})
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await getUserById(match.params.id)

            setInputs(profile);
        }
        fetchProfile();
    }, [match])

    const handleChange = (e: any, field: string) => {
        setInputs({...inputs, [field]: e.target.value});
    }

    return inputs === undefined ? (
            <Loader />
        ) :
            <div className={'root'}>
                <img src={require("../../resources/pictureBackground3.jpeg")} id={"bg"} alt={""}></img>
                <Row className="justify-content-md-center">
                <Card style={{top:'5rem', width: '50rem'}} border="dark" className="text-center p-3">
                    <Card.Body>
                        <Card.Title className="mb-10 text" >Update your profile</Card.Title>
                        <br/>
                        <form className="formCenter" onSubmit={(e) => changeParams(e)}>
                            <Form.Group as={Row} controlId="formBasicEmail">
                                <Form.Label column sm="2">
                                    Email
                                </Form.Label>
                                <Col md="auto">
                                    <input className="form-control" type="email" value={inputs.mail} onChange={(e) => handleChange(e, "mail")} required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2">
                                    Name
                                </Form.Label>
                                <Col md="auto">
                                    <input className="form-control" type="text" value={inputs.lastName} onChange={(e) => handleChange(e, "lastName")} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2">
                                    First name
                                </Form.Label>
                                <Col md="auto">
                                    <input className="form-control" type="text" value={inputs.firstName} onChange={(e) => handleChange(e, "firstName")} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2">
                                    Phone number
                                </Form.Label>
                                <Col md="auto">
                                    <input className="form-control" type="text" value={inputs.phone} onChange={(e) => handleChange(e, "phone")} />
                                </Col>
                            </Form.Group>
                            <br/>
                            <Button type="submit" value="Submit">Submit</Button>
                        </form>
                    </Card.Body>
                </Card>
                </Row>
            </div>
}

export default memo(EditProfile)