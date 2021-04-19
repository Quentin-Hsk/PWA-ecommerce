import * as express from "express";
import * as createError from "http-errors";
import User from "../models/user";

const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/login', (req: any, res: any, next: Function) => {
    console.log("4567890");
    passport.authenticate("local", async (err: Error, user: any, info: any) => {
        if (err) {
            console.log(err);
            return next(createError(500, err));
        }
        if (!user)
            return next(createError(401, err));
        await req.logIn(user, async (err: Error) => {
            if (err) {
                console.log(err)
                return next(createError(500, err));
            }
            const token = await jwt.sign(user.toJSON(), "toto4242", { expiresIn: 3600 });
            res.status(200).json({ data: user, token: token });
        });
    })(req, res, next);
});

router.post('/register', async (req: any, res: any, next: Function) => {
    console.log("456456789");
    const user = new User({
        alias: req.body.alias, mail: req.body.mail, password: req.body.password,
        phone: req.body.phone, firstName: null, lastName: null,
        avatarURL: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
    })
    console.log("456789");
    await User.findOne({ mail: req.body.mail }, async (err: Error, existing_user: any) => {
        if (err) {
            console.log(err);
            return next(createError(500, err));
        }
        if (existing_user)
            return next(createError(409));
        await user.save(async (err: Error) => {
            if (err)
                return next(createError(409, err));
            await req.logIn(user, async (err: Error) => {
                if (err) {
                    console.log(err);
                    return next(createError(500, err));
                }
                const token = await jwt.sign(user.toJSON(), "toto4242", { expiresIn: 3600 });
                res.status(200).json({ data: user, token: token });
            });
        });
    })
});

router.get('/logout', (req: any, res: express.Response) => {
    req.logout();
    res.status(200).json({ ok: true });
});

export default router;
