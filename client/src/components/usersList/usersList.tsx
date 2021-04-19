import React, { useState, useEffect, useCallback, memo } from "react";

import { getUsers } from "../../services/api"
import { useHistory } from 'react-router-dom'

import { IUser } from "../../types"

import "./usersList.scss"

const UsersList = () => {
    const [users, setUsers] = useState<Array<IUser>>([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();
    const history = useHistory();

    const trackScrolling = useCallback(() => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight && maxPage !== undefined && page < maxPage) {
            setPage(page + 1);
        }
    }, [page, maxPage]);

    const fetchUsersCB = useCallback(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getUsers(page);

            setUsers(users => [...users, ...fetchedUsers.data]);
            setMaxPage(fetchedUsers.page);
        }
        fetchUsers();
    }, [page]);

    useEffect(() => {
        document.addEventListener('scroll', trackScrolling);
        return function cleanup() {
            document.removeEventListener('scroll', trackScrolling);
        };
    }, [trackScrolling]);

    useEffect(() => {
        fetchUsersCB();
    }, [fetchUsersCB])

    return (
        <div className="users-list">
            {users.map((user: IUser) => {
                return (
                    <div className="users-list__user" key={user._id}>
                        <img className="users-list__user-picture" src={user.avatarURL} alt="User profile" onClick={() => history.push(`/profile/${user._id}`)} />
                        <div className="users-list__user-infos">
                            <div>{user.alias}</div>
                            <div>{user.mail}</div>
                            <div>{user.phone}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default memo(UsersList);