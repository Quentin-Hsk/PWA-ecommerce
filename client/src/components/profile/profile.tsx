import React, { FunctionComponent, memo, useEffect, useCallback, useState } from "react";

import "./profile.scss"
import { IFeed, Size } from "../../types"
import { Button, Col, Container, Row, Image } from "react-bootstrap";
import Modal from "../utils/modal";
import Picture from "../common/picture"
import Cookies from 'js-cookie'
import { deleteAccount, getUserById, getUserImages } from "../../services/api";
import Loader from "../utils/loader";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";


const ColoredLine = () => (
    <hr style={{
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

const Profile: FunctionComponent<IProps> = ({ match }) => {
    const [idUser, setIdUser] = useState();
    const [profile, setProfile] = useState();
    const [customButton, setCustomButton] = useState();
    const [listImage, setListImage] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openPicture, setOpenPicture] = useState();
    const { addToast } = useToasts()
    const history = useHistory();

    const deleteProfile = useCallback(() => {
        const fetchDelete = async () => {
            const response = await deleteAccount(match.params.id);
            console.log(response)
            if (response) {
                addToast("Your profile has been deleted :(... Hope see you soon!" + response.alias, {
                    appearance: 'success',
                    autoDismiss: true,
                });
                Cookies.remove("token");
                Cookies.remove("id");
                history.push("/login/signin");
            } else {
                addToast("Oops there is an Error", { appearance: 'error', autoDismiss: true })
                // window.location.reload();
            }
        }
        fetchDelete();
    }, [history, match, addToast]);

    const checkParam = useCallback(() => {
        let button;
        let idUsers;

        if (match.params.id !== Cookies.get("id")) {
            idUsers = match.params.id;
        } else {
            idUsers = Cookies.get("id");
            button = <div>
                <Row>
                    <Col>
                        <Button variant="outline-dark" onClick={() => history.push("/edit/" + Cookies.get("id"))}
                            size="sm">Update my profile</Button>
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={() => deleteProfile()}> Delete my account</Button>
                    </Col>
                </Row>
            </div>
        }
        setIdUser(idUsers);
        setCustomButton(button);
    }, [history, match, deleteProfile]);

    useEffect(() => {
        checkParam();
    }, [checkParam])

    const fetchListImages = useCallback(() => {
        const fetchImages = async () => {
            const images = await getUserImages(idUser);
            setListImage(images.data);
        }
        fetchImages()
    }, [idUser])

    useEffect(() => {
        setOpenPicture((openPicture: any) => {
            if (openPicture !== undefined && isOpen) {
                const image: any = listImage.find((image: IFeed) => image._id === openPicture._id)
                console.log(image);
                return {
                    _id: image._id,
                    component: <Picture update={fetchListImages} closePicture={() => setIsOpen(false)} picture={{
                        _id: image._id,
                        author: { _id: image.author._id, alias: image.author.alias, avatarURL: image.author.avatarURL },
                        avatarURL: image.avatarURL,
                        source: image.source,
                        miniature: image.miniature,
                        description: image.description,
                        keywords: image.keywords,
                        mentions: image.mentions,
                        comments: image.comments,
                        likes: image.likes
                    }} />
                }
            } else {
                return openPicture;
            }
        });
    }, [listImage, fetchListImages, isOpen])

    useEffect(() => {
        if (!idUser)
            return
        const fetchProfil = async () => {
            const profile = await getUserById(idUser);

            setProfile(profile);
        }
        fetchProfil();
        fetchListImages();
    }, [idUser, fetchListImages])

    const handleClick = (image: IFeed) => {
        setIsOpen(true);
        setOpenPicture({
            _id: image._id,
            component: <Picture update={fetchListImages} closePicture={() => setIsOpen(false)
            } picture={{
                _id: image._id,
                author: { _id: image.author._id, alias: image.author.alias, avatarURL: image.author.avatarURL },
                avatarURL: image.avatarURL,
                source: image.source,
                miniature: image.miniature,
                description: image.description,
                keywords: image.keywords,
                mentions: image.mentions,
                comments: image.comments,
                likes: image.likes
            }} />
        });
    }


    return profile === undefined ? (
        <Loader />
    ) :
        <>
            <div>
                <Container>
                    <Container>
                        <br />
                        <br />
                        <Row className="justify-content-md-center" id={"justify-top-container"}>
                            <Col xs={5} md={3}>
                                <Image className={"imgFirst"}
                                    src={profile.avatarURL}
                                    rounded />
                            </Col>
                            <Col md="auto">
                                <h2>{profile.alias}</h2>
                                <p><b>Mail:</b> {profile.mail}</p>
                                <p><b>Phone number:</b> {profile.phone}</p>
                                <p><b>Date of registration:</b> {profile.createdAt}</p>
                            </Col>
                            <Col xs lg="3">
                                {customButton}
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col xs={6} md={4}>
                            </Col>
                            <Col xs={6} md={{ span: 4, offset: 1 }}>
                                <h3>{profile.firstName} {profile.lastName}</h3>
                            </Col>
                            <Col xs={6} md={4}>
                            </Col>
                        </Row>
                        <br />
                        <br />
                        <ColoredLine />
                    </Container>
                    <Container>
                        <div className="profile__pictures-container">
                            {listImage.map((image: IFeed, i) => {
                                return (
                                    <Image key={i} onClick={() => handleClick(image)} className="imgSecond"
                                        src={image.source} />
                                )
                            })}
                        </div>
                    </Container>
                </Container>
            </div>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} size={Size.LARGE}>
                {openPicture && openPicture.component}
            </Modal>
        </>
}

export default memo(Profile);