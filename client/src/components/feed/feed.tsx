import React, { FunctionComponent, memo, useState, useEffect, useCallback } from "react";
import { useHistory } from 'react-router-dom'
import ExploreIcon from '@material-ui/icons/Explore';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import Picture from "../common/picture"
import { IFeed, IUser } from "../../types"
import { getImages, getImage, getRecommendation, getTrending } from "../../services/api"

import "./feed.scss"

interface IProps {
    fetchSearch?: Function,
    searchFeed?: Array<IFeed>
}

const Feed: FunctionComponent<IProps> = ({ fetchSearch, searchFeed }) => {
    const [feed, setFeed] = useState<Array<IFeed>>([]);
    const [recommendations, setRecommendations] = useState([]);
    const [trendings, setTrendings] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState();
    const history = useHistory();

    useEffect(() => {
        if (searchFeed)
            setFeed(searchFeed);
    }, [searchFeed]);

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

    useEffect(() => {
        document.addEventListener('scroll', trackScrolling);
        return function cleanup() {
            document.removeEventListener('scroll', trackScrolling);
        };
    }, [trackScrolling]);

    const fetchImages = useCallback(() => {
        const myFetch = async () => {
            const images = await getImages(page);

            setFeed((feed) => [...feed, ...images.data]);
            setMaxPage(images.page);
        }
        myFetch();
    }, [page]);

    const fetcher = fetchSearch || fetchImages;

    useEffect(() => {
        const fetchRecommendation = async () => {
            const result = await getRecommendation();

            setRecommendations(result.data);
        }
        const fetchTrending = async () => {
            const result = await getTrending();

            setTrendings(result.data);
        }

        fetchRecommendation();
        fetchTrending();
        fetcher();
    }, [fetcher]);

    const update = async (picId: string, isDelete: boolean = false) => {
        const result = isDelete ? undefined : (await getImage(picId));
        const newFeed = feed.reduce((acc: Array<IFeed>, pic: IFeed) => {
            if (isDelete === true && picId === pic._id)
                return acc;
            else if (result !== undefined && pic._id === result._id)
                return [...acc, result];
            else
                return [...acc, pic];
        }, []);

        setFeed(newFeed);
    }

    return (
        <div className="feed-container" style={fetchSearch !== undefined ? { width: "80%", margin: "0 auto" } : {}}>
            <div className="feed__aside">
                <div className="feed__recommendation" style={fetchSearch !== undefined ? { display: "none" } : {}}>
                    <div className="feed__recommendation__title" onClick={() => history.push("/explore")}>
                        <ExploreIcon /><span className="feed__recommendation__title-text">Recommendation</span>
                    </div>
                    {recommendations.map((user: IUser) =>
                        <div className="feed__recommendation__user" key={user._id} onClick={() => history.push(`/profile/${user._id}`)}>
                            {user.alias}
                        </div>
                    )}
                </div>
                <div className="feed__recommendation" style={fetchSearch !== undefined ? { display: "none" } : {}}>
                    <div className="feed__recommendation__title">
                        <TrendingUpIcon /><span className="feed__recommendation__title-text">Trending</span>
                    </div>
                    {trendings.map((trend: any) =>
                        <div className="feed__recommendation__user" key={trend.name} onClick={() => history.push(`/search?q=${trend.name}`)}>
                            {trend.name}
                        </div>
                    )}
                </div>
            </div>
            {feed.map((picture: IFeed, idx: number) => <Picture className="feed__picture" update={update} picture={picture} key={idx}></Picture>)}
        </div>
    )
}

export default memo(Feed);