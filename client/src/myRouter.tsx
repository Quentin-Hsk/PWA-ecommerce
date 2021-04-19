import React, { memo } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications'

import Menu from "./components/menu/menu";
import Feed from "./components/feed/feed";
import Profile from "./components/profile/profile"
import Explore from "./components/explore/explore"
import EditProfile from "./components/profile/editProfile"
import UsersList from "./components/usersList/usersList"
import SignIn from "./components/auth/signIn"
import SignUp from "./components/auth/signUp"
import Search from "./components/search/search"

const LoginContainer = () => {
    return (
        <div>
            <Route path="/login/signin" exact component={SignIn}></Route>
            <Route path="/login/signup" exact component={SignUp}></Route>
        </div>
    )
}

const DefaultContainer = () => {
    return (
        <>
            <Menu />
            <div style={{ paddingTop: "70px" }}>
                <Route path="/" exact component={Feed} />
                <Route path="/profile/:id" exact component={Profile} />
                <Route path="/explore" exact component={Explore} />
                <Route path="/edit/:id" exact component={EditProfile} />
                <Route path="/users" exact component={UsersList} />
                <Route path="/search" exact component={Search} />
            </div>
        </>
    )
}

const MyRouter = () => {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={LoginContainer} />
                    <Route component={DefaultContainer} />
                </Switch>
            </BrowserRouter>
        </ToastProvider>
    );
};

export default memo(MyRouter);