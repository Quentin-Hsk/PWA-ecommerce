import * as createError from "http-errors";
import User from "../models/user";

const passport = require('passport')
const Local = require('passport-local').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const Jwt = require('passport-jwt').Strategy;

passport.use(new Local({ usernameField: "mail" }, async (mail: string, password: string, next: Function) => {
    console.log("toto");
    await User.findOne({ mail: mail }, async (err: Error, user: any) => {
        if (err) {
            console.log("ghjkl")
            return next(createError(500, err));
        }
        if (!user)
            return next(createError(401, err));
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) {
                console.log("RTYUI")
                return next(createError(500, err));
            }
            if (isMatch)
                return next(undefined, user);
            return next(createError(401));
        });
    });
}));

passport.use(new Jwt({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'toto4242'
}, (jwtPayload: any, next: Function) => {
    try {
        User.findOne({ _id: jwtPayload._id }, (err: Error, user: any) => {
            return next(err, user);
        });
    } catch (err) {
        console.log(err);
    }
}));

passport.serializeUser(function (user: any, next: Function) {
    next(null, user);
});

passport.deserializeUser(async (user: any, next: Function) => {
    await User.findOne({ _id: user._id }, (err: Error, user: any) => {
        next(err, user);
  });
});
