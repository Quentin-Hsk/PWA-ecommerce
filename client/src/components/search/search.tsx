import React, { memo, useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import { searchImage } from "../../services/api"
import Loader from "../utils/loader"
import Feed from "../feed/feed"

const Search = () => {
    const { q } = queryString.parse(useLocation().search);
    const [feed, setFeed] = useState();

    const fetchImages = useCallback(() => {
        const myFetch = async () => {
            const images = await searchImage(q as string);

            setFeed(images.data);
        }
        myFetch();
    }, [q]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    return feed === undefined ? (
        <Loader />
    ) :
        <>
            <h1>{q}</h1>
            <Feed fetchSearch={fetchImages} searchFeed={feed} />
        </>
}

export default memo(Search);