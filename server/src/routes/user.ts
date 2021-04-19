import * as express from "express";
import * as createError from "http-errors";

import User from "../models/user";

const router = express.Router();
const number_of_user_per_page = 5;

// Automatically get the associated DB object when an id is involved
// NOTE: The special value `me` refers to the current user
router.param("id", async (req, res, next, id) => {
    let user = null;
    if (id !== "me") {
        try {
            user = await User.findById(id, { password: 0 });
        } catch (err) {
            return next(createError(500, err));
        }
    } else {
        user = res.locals.user;
    }
    if (user === null) {
        return next(createError(404));
    }
    res.locals.requestedUser = user;
    next();
});

// Research user profile
router.get('/search', async (req: express.Request, res: express.Response) => {
    const search = (req.query.q as string).normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const users = await User.find({ alias: { $regex: search, $options: 'i' } }, { password: 0 }).limit(10);
    res.status(200).json({ data: users });
});

// Get user profile
router.get('/:id', (req: express.Request, res: express.Response) => {
    res.status(200).json(res.locals.requestedUser);
});

// List user images
router.get("/:id/images", async (req: express.Request, res: express.Response) => {
    try {
        const images = await res.locals.requestedUser.findImages();
        res.status(200).json({ data: images });
    } catch (err) {
        res.status(404).json({ err: err });
    }
});

// Get user's notifications
router.get("/:id/notif", async (req: express.Request, res: express.Response) => {
    try {
        const notifications = await res.locals.requestedUser.findNotification();
        res.status(200).json({ data: notifications });
    } catch (err) {
        res.status(200).json({ data: [] });
    }
});

// Mark user's notifications as readed
router.post("/:id/notif", async (req: express.Request, res: express.Response) => {
    try {
        await res.locals.requestedUser.deleteNotifications(req.body.notifications);
        res.status(204).end();
    } catch (err) {
        res.status(404).json({ err: err });
    }
});

// Get user recommendation
router.get(
    "/me/recommendation",
    async (req: any, res: express.Response) => {
        const me = await User.findById(req.session.passport.user._id);
        const images = await me.findImages();
        const keywords = Array.from(
            new Set(images.map((image) => image.keywords).reduce((acc, val) => acc.concat(val), [])).values()
        );
        const users = await User.find(
            { _id: { $ne: req.session.passport.user._id } },
            null,
            {
                sort: { createdAt: -1 },
            }
        );
        const reco = [];
        for (let it = 0; it < users.length; it++) {
            const imagesFound = await users[it].findImages();
            const userImagesKeys = Array.from(
                new Set(
                    imagesFound
                        .map((image) => image.keywords)
                        .reduce((acc, val) => acc.concat(val), [])
                        .values()
                )
            );
            if (
                keywords.filter((key) => userImagesKeys.indexOf(key) !== -1)
                    .length > 0
            )
                reco.push(users[it]);
        }
        res.status(200).json({ data: reco });
    }
);

// Delete his account
router.delete("/me", async (req: any, res: express.Response) => {
    try {
        await User.findOneAndDelete({ _id: req.session.passport.user._id });
        res.status(200).json({ ok: true });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

// Update user details
router.put("/me", async (req: any, res: express.Response) => {
    try {
        if (!req.session.passport.user._id)
            res.status(404).json({ ok: false });
        else {
            const me = await User.findOneAndUpdate({ _id: req.session.passport.user._id }, req.body, { new: true });
            res.status(200).json({ data: me });
        }
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

// Get all users
router.get("/", async (req: express.Request, res: express.Response) => {
    try {
        const users = await User.find({}, { password: 0 }, { sort: { createdAt: -1 } });
        const total_page = Math.ceil(users.length / number_of_user_per_page);
        const required_page = parseInt((req.query.q as string), 10);
        if (required_page > 0 && required_page <= Math.ceil(users.length / number_of_user_per_page)) {
            const user_list = users.slice((required_page * number_of_user_per_page) - number_of_user_per_page,
                Math.min(users.length, required_page * number_of_user_per_page));
            res.status(200).json({ data: user_list, page: total_page });
        } else {
            res.status(400).json({ err: `Page ${required_page} invalid` });
        }
    } catch (err) {
        res.status(404).json({ err: err });
    }
});

export default router;
