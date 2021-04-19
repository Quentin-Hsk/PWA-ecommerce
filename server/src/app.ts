import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';

import user from "./routes/user";
import auth from "./routes/auth";
import image from "./routes/image";

import renderError from "./middleware/error";
require("./middleware/auth");

const passport = require('passport');
const session = require('express-session')

export const app = express();

const http = require("http").createServer(app);
export const io = require("socket.io")(http);

export default (port: Number) =>
    new Promise((resolve, reject) => {
        try {
            http.listen(port, resolve);
        } catch (err) {
            reject(err);
        }
    });

export const clientConnected = [];

/*io.on("connection", (socket) => {
    socket.on("storeClientInfo", (info) => {
        clientConnected.push({ userId: info.userId, socketId: socket.id });
        console.log(clientConnected);
    });

    socket.on("disconnect", () => {
        console.log("disconnect");
        const index = clientConnected.findIndex((client => client.socketId === socket.id));
        clientConnected.splice(index, 1);
        console.log(clientConnected);
    });
});*/

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));

app.use(session({ secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", auth);
app.use("/users", passport.authenticate('jwt'), user);
app.use("/images", passport.authenticate('jwt'), image);

app.use(renderError);
