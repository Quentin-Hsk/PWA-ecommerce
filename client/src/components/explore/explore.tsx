import React, { useState, useEffect, memo } from "react";
import { useHistory } from 'react-router-dom'

import { getRecommendation } from "../../services/api"
import { IUser } from "../../types"

import "./explore.scss"

const Explore = () => {
    const [recommendations, setRecommendations] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchRecommendation = async () => {
            const result = await getRecommendation();

            setRecommendations(result.data);
        }

        fetchRecommendation();
    }, [])

    return (
        <div className="explore">
            <h1>Recommendation</h1>
            <div>
                {recommendations.map((user: IUser) => (
                    <div className="explore__user" key={user._id} onClick={() => history.push(`/profile/${user._id}`)}>
                        {user.alias}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(Explore);