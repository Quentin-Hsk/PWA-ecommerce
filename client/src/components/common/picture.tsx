import React, { FunctionComponent, useState, memo, useEffect, useCallback } from "react";

import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MenuModal from "./menuModal"
import { IFeed, IUser, IComment, ILike } from "../../types"

import Cookies from "js-cookie";
import { useHistory } from 'react-router-dom'
import IsLike from '@material-ui/icons/Favorite'
import IsNotLike from '@material-ui/icons/FavoriteBorder'

import "./picture.scss"

import { deleteImage, publishComment, updateStatutPicture } from "../../services/api";
import { useToasts } from "react-toast-notifications";
import Modal from "../utils/modal"

import { Size } from "../../types"

interface IProps {
    className?: string,
    update: Function,
    picture: IFeed,
    closePicture?: Function
}

const Picture: FunctionComponent<IProps> = ({ className, update, picture, closePicture }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [comment, setComment] = useState("");
    const history = useHistory()
    const { addToast } = useToasts()
    const [isLike, setIsLike] = useState(false);
    const [show, setShow] = useState(false);
    const info = {
        id: picture._id,
        description: picture.description,
        keywords: picture.keywords,
        mentions: picture.mentions,
        likes: picture.likes
    }

    const changeLikePicture = async (id: string) => {
        const res = await updateStatutPicture(id, Cookies.get("id") || "");
        if (res.ok || res !== undefined) {
            if (isLike) {
                addToast("Your are disliked the picture", {
                    appearance: 'warning',
                    autoDismiss: true,
                });
            } else {
                addToast("Your are liked the picture", {
                    appearance: 'success',
                    autoDismiss: true,
                });
            }
            update(id);
        } else {
            addToast("Error", { appearance: 'error', autoDismiss: false })
        }
    }

    const checkIsLiked = useCallback((pic: IFeed) => {
        const isLike = pic.likes.every((i: ILike) => !(i._id === Cookies.get("id")));

        setIsLike(!isLike);
    }, []);

    useEffect(() => {
        checkIsLiked(picture);
    }, [checkIsLiked, picture])

    const handleRedirect = (id: string) => {
        history.push(`/profile/${id}`);
    }

    const fetchDelete = async () => {
        const res = await deleteImage(picture._id);

        if (res.ok) {
            addToast("Your image has been deleted", {
                appearance: 'success',
                autoDismiss: true,
            });
            if (closePicture !== undefined)
                closePicture();
            update(picture._id, true);
        } else {
            addToast("Error", { appearance: 'error', autoDismiss: false })
        }
    }

    const handlePublish = async () => {
        if (comment === "") return;
        const res = await publishComment(picture._id, Cookies.get("id") || "", comment);

        if (res !== undefined) {
            update(picture._id);
            addToast("Comment with success", { appearance: 'success', autoDismiss: true });
            setComment("");
        } else {
            addToast("Error", { appearance: 'error', autoDismiss: false });
        }
    }

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    return (
        <>
            <div className={className}>
                <div className="picture__author">
                    <img className="picture__author__pic" src={picture.author.avatarURL} alt="author"
                        onClick={() => handleRedirect(picture.author._id)} />
                    <div className="picture__author__name"
                        onClick={() => handleRedirect(picture.author._id)}>{picture.author.alias}</div>
                    {picture.author._id === Cookies.get("id") &&
                        <DeleteForeverIcon style={{ marginLeft: "auto", cursor: "pointer" }} onClick={() => fetchDelete()} />}
                    {picture.author._id === Cookies.get("id") &&
                        <EditIcon style={{ marginLeft: "10px", cursor: "pointer" }} onClick={() => setIsOpen(true)} />}
                </div>
                <img className="picture__pic" src={picture.source} alt="content" />
                <div className="picture__pic__like">
                    {isLike ? <IsLike className="cursor__pointer" fontSize="large" onClick={() => changeLikePicture(info.id)} /> :
                        <IsNotLike className="cursor__pointer" fontSize="large" onClick={() => changeLikePicture(info.id)} />}
                    {info.likes.length > 0 &&
                        <div className="picture__pic__like-list">
                            {info.likes.length > 1 ?
                                <div> Liked by <span className="cursor__pointer__list" onClick={() => handleRedirect(info.likes[0]._id)}>{info.likes[0].alias}</span> et <span className="cursor__pointer__list" onClick={handleShow}>{info.likes.length - 1} other people</span></div> :
                                <div> Liked by <span className="cursor__pointer__list" onClick={() => handleRedirect(info.likes[0]._id)}>{info.likes[0].alias}</span></div>}
                        </div>
                    }
                </div>
                <div className="picture__description">
                    <div>
                        <span className="picture__description__author"
                            onClick={() => handleRedirect(picture.author._id)}>
                            {picture.author.alias}&nbsp;
                        </span>
                        {picture.description}
                        {picture.keywords.map((hashtag: string, idx: number) => <span
                            className="picture__description__hashtag" key={idx}> #{hashtag}</span>)}
                    </div>
                </div>
                {picture.mentions.length > 0 &&
                    <div className="picture__mentionned">
                        Was with{picture.mentions.map((mention: IUser) => <div className="picture__mentionned__name"
                            key={mention._id}
                            onClick={() => handleRedirect(mention._id)}>&nbsp;{`@${mention.alias}`}</div>)}
                    </div>
                }
                <div className="picture__post-comment">
                    <textarea className="picture__post-comment__input" value={comment}
                        onChange={(e) => setComment(e.target.value)} rows={1} placeholder="Add a comment ..." />
                    <div className="picture__post-comment__button" onClick={handlePublish}>Publish</div>
                </div>
                {picture.comments.length > 0 &&
                    <div className="picture__comments">
                        {picture.comments.slice(0).reverse().map((comment: IComment) => {
                            return (
                                <div className="picture__comment" key={comment._id}>
                                    <span className="picture__comment__author"
                                        onClick={() => handleRedirect(comment.author._id)}>
                                        {comment.author.alias}&nbsp;
                                    </span>
                                    {comment.text}
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
            <MenuModal info={info} isOpen={isOpen} close={() => setIsOpen(false)} update={update} isUpdate={true} />
            <Modal title="Reaction list" isOpen={show} close={handleClose} size={Size.LARGE}>
                <div className="picture__like">
                    {info.likes.map((i: ILike, index) => {
                        return <div key={index}><p>Aimé par <a href={`/profile/${i._id}`}>{i.alias}</a>.</p></div>
                    })}
                </div>
            </Modal>
        </>
    )
}

export default memo(Picture);