import React, { FunctionComponent, useState, memo } from "react";

import Modal from "../utils/modal"
import Tags from "../utils/tags"
import { IUser } from "../../types"
import Cookies from 'js-cookie'
import { updateImage, uploadImage, searchUser } from "../../services/api"

import "./menuModal.scss"
import { useToasts } from "react-toast-notifications";

interface IProps {
    info?: { id: string, description: string, keywords: Array<string>, mentions: Array<IUser> },
    isOpen: boolean,
    close: Function,
    update?: Function,
    isUpdate?: boolean
}

const MenuModal: FunctionComponent<IProps> = ({ info, isOpen, close, update, isUpdate = false }) => {
    const mentions = info && info.mentions.map((user: IUser) => user.alias);

    const [file, setFile] = useState()
    const [filename, setFilename] = useState("");
    const [description, setDescription] = useState(info ? info.description : "");
    const [hashtags, setHashtags] = useState<string[]>(info ? info.keywords : []);
    const [mentionned, setMentionned] = useState<string[]>(mentions || []);
    const { addToast } = useToasts();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event && event.target && event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0])
            setFilename(event.target.files[0].name)
        } else {
            setFile(undefined)
            setFilename("")
        }
    }

    const handleClick = async () => {
        if (isUpdate && update && info) {
            const result = await updateImage(info.id, {
                description,
                keywords: hashtags,
                mentions: mentionned
            });

            if (result !== undefined) {
                addToast("Picture updated", {
                    appearance: 'success',
                    autoDismiss: true,
                });
                update(info.id);
                close();
            } else {
                addToast("Error", { appearance: 'error', autoDismiss: false });
            }
        } else {
            if (Cookies.get("id") !== undefined) {
                const fd = new FormData();

                fd.append("source", file);
                fd.append("author", Cookies.get("id") || "");
                fd.append("description", description);
                hashtags.forEach((hashtag: string) => fd.append("keywords", hashtag));
                mentionned.forEach((mention: string) => fd.append("mentions", mention));
                const result = await uploadImage(fd);
                if (result !== undefined)
                    window.location.reload();
            }
        }
    }

    return (
        <>
            <Modal title={isUpdate ? "Edit picture" : "New picture"} isOpen={isOpen} close={close}>
                {!isUpdate &&
                    <>
                        <div className="menu-modal__upload-container">
                            <div className="menu-modal__upload">
                                <div className="menu-modal__upload-button">Upload picture</div>
                                <input className="menu-modal__upload-input" type="file" onChange={handleChange} />
                            </div>
                            <div className="menu-modal__upload-name">{filename}</div>
                        </div>
                        <hr className="menu-modal__separator" />
                    </>
                }
                <div className="menu-modal__infos">
                    <label className="menu-modal__label">Description</label>
                    <textarea className="menu-modal__description" defaultValue={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    <label className="menu-modal__label">Mentionned</label>
                    <Tags tags={mentionned} setTags={setMentionned} getOptions={searchUser} />
                    <label className="menu-modal__label">Hashtags</label>
                    <Tags tags={hashtags} setTags={setHashtags} />
                </div>
                <div className="menu-modal__save-button" onClick={handleClick}>Enregistrer</div>
            </Modal>
        </>
    )
}

export default memo(MenuModal);