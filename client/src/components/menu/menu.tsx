import React, { memo, useEffect, useState } from "react";
import PublishIcon from '@material-ui/icons/Publish';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GroupIcon from '@material-ui/icons/Group';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExploreIcon from '@material-ui/icons/Explore';
import { useHistory } from 'react-router-dom'
import socketIOClient from "socket.io-client";

import MenuModal from "../common/menuModal"

import { withConfiguration } from "../../services/config";
import "./menu.scss";
import Cookies from "js-cookie";
import { searchUser, getNotif, removeNotif } from "../../services/api";
import { IUser, INotif } from "../../types"

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [notifIsOpen, setNotifIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState<IUser[]>([]);
    const [optionIsOpen, setOptionIsOpen] = useState(false);
    const [notif, setNotif] = useState<INotif[]>([]);
    const history = useHistory();

    useEffect(() => {
        withConfiguration((config: any) => {
            const socket = socketIOClient(config["serverUrl"]);

            socket.on('connect', () => {
                socket.emit('storeClientInfo', { userId: Cookies.get("id") });
            });

            socket.on("notif", (data: any) => {
                console.log(data);
                setNotif((notif) => [data, ...notif])
            });
        });

        const fetchNotif = async () => {
            const result = await getNotif(Cookies.get("id") || "");

            setNotif((notif) => [...result.data, ...notif]);
        }
        fetchNotif();
    }, [])

    const logOut = () => {
        Cookies.remove("token");
        history.push("/login/signin");
    }

    const handleMenu = () => {
        if (menuIsOpen)
            setNotifIsOpen(false);
        setMenuIsOpen(!menuIsOpen);
    }

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (value !== "") {
            const result = await searchUser(value);

            setOptions(result.data);
        } else {
            setOptions([]);
        }
        setSearch(value);
    }

    const handleClick = () => {
        history.push(`/search?q=${search}`);
    }

    const handleClickNotif = async () => {
        if (notifIsOpen) {
            await removeNotif(Cookies.get("id") || "", { notifications: notif });
            setNotif([]);
        }
        setNotifIsOpen(!notifIsOpen);
    }

    return (
        <>
            <div className="menu-container">
                <h1 className="menu-container__title" onClick={() => history.push("/")}>UGram</h1>
                <div className="menu-container__input-container">
                    <input placeholder="Rechercher" className="menu-container__input" value={search} onChange={handleChange} onFocus={() => setOptionIsOpen(true)} onBlur={() => setOptionIsOpen(false)} />
                    <ul className="menu-container__input__options" style={{ display: optionIsOpen ? "block" : "none" }}>
                        {search === "" ?
                            <li className="menu-container__input__option menu-container__input__option--hashtag">
                                Enter at least one letter
                            </li>
                            :
                            <li className="menu-container__input__option menu-container__input__option--hashtag" onMouseDown={() => handleClick()}>
                                <div className="menu-container__input__option-icon menu-container__input__option-icon__hashtag">#</div>Hashtag / Description
                            </li>
                        }
                        {options.map((option: IUser) =>
                            <li key={option._id} className="menu-container__input__option" onMouseDown={() => history.push(`/profile/${option._id}`)}>
                                <img src={option.avatarURL} className="menu-container__input__option-icon" alt="user" />
                                {option.alias}
                            </li>
                        )}
                    </ul>
                </div>
                <MenuOpenIcon className="menu-container__mobile-menu" onClick={handleMenu} />
                <div className="menu-container__buttons" style={menuIsOpen ? { right: 0 } : {}}>
                    <PublishIcon onClick={() => setIsOpen(true)} />
                    <div className="menu-container__buttons-notif">
                        <NotificationsIcon onClick={handleClickNotif} />
                        {notif.length > 0 && <div className="menu-container__buttons-notif__count" onClick={() => setNotifIsOpen(!notifIsOpen)}>{notif.length <= 9 ? notif.length : "+9"}</div>}
                        <div className="menu-container__buttons-notif__container" style={{ display: notifIsOpen ? "block" : "none" }}>
                            <div className="menu-container__buttons-notif__square" />
                            <div className="menu-container__buttons-notif__content">
                                {notif.map((n: INotif) =>
                                    <div className="menu-container__buttons-notif__content__notif" key={n.createdAt}>
                                        <img className="menu-container__buttons-notif__content__notif-img" src={n.image.source} alt="notified pic" />
                                        <div>
                                            <span className="menu-container__buttons-notif__content__notif-alias">{n.from.alias}</span> à laissé un {n.type === "0" ? "commentaire" : "like"} sur votre photo
                                        </div>
                                    </div>
                                )}
                                {notif.length === 0 && <div>You don't have any notification</div>}
                            </div>
                        </div>
                    </div>
                    <ExploreIcon onClick={() => history.push("/explore")} />
                    <AccountCircleIcon onClick={() => history.push("/profile/" + Cookies.get("id"))} />
                    <GroupIcon onClick={() => history.push("/users")} />
                    <ExitToAppIcon onClick={() => logOut()} />
                </div>
            </div>
            <MenuModal isOpen={isOpen} close={() => setIsOpen(false)} />
        </>
    );
}

export default memo(Menu);