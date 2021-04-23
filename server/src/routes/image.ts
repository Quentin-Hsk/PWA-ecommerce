import * as express from "express";
const createError = require("http-errors");
import * as multer from "multer";
import Image from "../models/image";
import Comment from "../models/comment";
import Notification from "../models/notification";
import User from "../models/user";

import { io, clientConnected } from "../app";

const number_of_image_per_page = 5;

const router = express.Router();

router.param(
    "id",
    async (
        req: express.Request,
        res: express.Response,
        next: Function,
        id: Number
    ) => {
        let image = null;
        try {
            image = await Image.findById(id).populate("mentions author comments likes").populate({
                path: 'comments', populate: { path: 'author' }
            });
        } catch (err) {
            return next(createError(500, err));
        }

        if (image === null) {
            return next(createError(404));
        }

        res.locals.requestedImage = image;
        next();
    }
);

// Get all images by research
router.get("/search", async (req: express.Request, res: express.Response) => {
    let q = req.query.q;
    let images = await Image.find()
        .populate("mentions author comments likes")
        .populate({ path: 'comments', populate: { path: 'author' } })
        .sort("-_id");
    let imageMap = [];
    images.forEach(function (image: any) {
        let status = false;
        if (
            image.description &&
            image.description.toLowerCase().indexOf((q as any).toLowerCase()) !== -1
        ) {
            status = true;
        } else if (image.keywords) {
            image.keywords.forEach(function (keyword: any) {
                if (keyword.toLowerCase().indexOf((q as any).toLowerCase()) !== -1) {
                    status = true;
                }
            });
        }
        if (status) {
            imageMap.push(image);
        }
    });
    res.status(200).json({ ok: true, data: imageMap });
});

// Get the five most popular images
router.get("/trending", async (req: express.Request, res: express.Response) => {
    let images = await Image.find({})
        .populate("mentions author comments likes")
        .populate({ path: 'comments', populate: { path: 'author' } })
        .sort("-_id");
    const trending_hashtag = images.reduce((acc: any, it: any) => {
        for (const hashtag of it.keywords)
            acc[hashtag] = acc[hashtag] + 1 || 1;
        return acc;
    }, {});
    let ordered_keywords = Object.entries(trending_hashtag)
        .sort(([, v1], [, v2]) => +v2 - +v1)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    const trend = Object.keys(ordered_keywords).map(elem => {
        return { name: elem, searched: ordered_keywords[elem] };
    });
    res.status(200).json({ data: trend.slice(0, 5) });
});

// Get individual image
router.get("/:id", (req: express.Request, res: express.Response) => {
    res.status(200).json(res.locals.requestedImage);
});

// Delete existing image
router.delete("/:id", async (req: express.Request, res: express.Response) => {
    try {
        await res.locals.requestedImage.remove();
    } catch (err) {
        res.status(500).send(err);
    }
    res.status(200).json({ ok: true });
});

// Update image details
router.put("/:id", async (req: express.Request, res: express.Response) => {
    try {
        if (req.body.likes) {
            if (res.locals.requestedImage.likes.some((elem: any) => elem && elem.id === req.body.likes._id)) {
                req.body.likes = res.locals.requestedImage.likes.filter((elem: any) => elem.id !== req.body.likes._id);
            } else {
                req.body.likes = [...res.locals.requestedImage.likes, req.body.likes];

                const user = await User.findById({ _id: (req as any).session.passport.user._id });
                clientConnected.map(async client => {
                    if (client.userId == res.locals.requestedImage.author._id) {
                        const notif = {
                            createdAt: new Date(),
                            to: res.locals.requestedImage.author,
                            from: user,
                            image: res.locals.requestedImage,
                            type: "1"
                        };
                        const { _id } = await Notification.create(notif);

                        io.sockets.connected[client.socketId].emit("notif", { ...notif, _id });
                    }
                });
            }
        }
        if (req.body.mentions) {
            req.body.mentions = await Promise.all(
                req.body.mentions.map(async mention => await User.findOne({ alias: mention })));
        }
        await res.locals.requestedImage.updateOne(req.body);
    } catch (err) {
        res.status(500).send(err);
    }
    res.status(204).end();
});

// Upload new image
router.post(
    "/",
    async (req: express.Request, res: express.Response) => {
        var mentions = [];
        try {
            const author = await User.findById(req.body.author);
            if (typeof req.body.mentions === "string") {
                mentions.push(await User.findOne({ alias: req.body.mentions }));
            } else if (req.body.mentions) {
                mentions = await Promise.all(
                    req.body.mentions.map(
                        async mention => await User.findOne({ alias: mention })
                    )
                );
            }
            await Image.create([
                {
                    createdAt: new Date(),
                    author: author,
                    source: (req as any).file.location,
                    description: req.body.description,
                    keywords: req.body.keywords,
                    mentions: mentions,
                    miniature: (req as any).file.location + "-thumbnail"
                    //(req as any).file.location.slice(0, -4)+"-thumbnail" +(req as any).file.location.slice(-4)
                }
            ]);
        } catch (err) {
            res.status(500).send(err);
        }
        res.status(204).end();
    }
);

// Add new comment
router.post("/:id/comment", async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.findById({ _id: req.body.author });
        if (user === null)
            res.status(404).send({ err: "Not Found" });
        const com = await Comment.create({ author: user, text: req.body.text });
        const comments = [...res.locals.requestedImage.comments, com];
        await res.locals.requestedImage.updateOne({ comments: comments });

        clientConnected.map(async client => {
            if (client.userId == res.locals.requestedImage.author._id) {
                const notif = {
                    createdAt: new Date(),
                    to: res.locals.requestedImage.author,
                    from: user,
                    image: res.locals.requestedImage,
                    type: "0"
                };
                const { _id } = await Notification.create(notif);

                io.sockets.connected[client.socketId].emit("notif", { ...notif, _id });
            }
        });
        res.status(204).end();
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get all images
router.get("/", async (req: express.Request, res: express.Response) => {
    let images = await Image.find()
        .populate("mentions author comments likes")
        .populate({ path: 'comments', populate: { path: 'author' } })
        .sort("-_id");
    const total_page = Math.ceil(images.length / number_of_image_per_page);
    const required_page = parseInt((req.query.q as string), 10);
    if (required_page > 0 && required_page <= Math.ceil(images.length / number_of_image_per_page)) {
        images = images.slice((required_page * number_of_image_per_page) - number_of_image_per_page,
            Math.min(images.length, required_page * number_of_image_per_page));
        res.status(200).json({ ok: true, data: images, page: total_page });
    } else {
        res.status(400).json({ err: `Page ${required_page} invalid` });
    }
});

export default router;
