import * as mongoose from 'mongoose';
import * as createError from "http-errors";

import Image from './image';
import Notification from './notification';

const findOrCreate = require('mongoose-find-or-create')
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt-nodejs');

// LATER: Maybe improve these regex to fit better?
const ALIAS_REGEX = /(?!me)[a-z0-9_\.]+/;
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PHONE_REGEX = /\+?[0-9]+/;

// TODO: Add URL validator
const userSchema = new mongoose.Schema({
    alias: { type: String, match: ALIAS_REGEX, required: true, unique: true },
    password: { type: String, match: ALIAS_REGEX, required: true },
    mail: { type: String, match: EMAIL_REGEX, required: true, unique: true },
    phone: { type: String, match: PHONE_REGEX },
    createdAt: { type: Date, default: Date.now },
    avatarURL: String,
    firstName: String,
    lastName: String,
});

userSchema.pre("save", function save(next: Function) {
    if (!this.isModified("password"))
        return next(createError(409));
    bcrypt.genSalt(10, (err: Error, salt) => {
        if (err)
            return next(createError(500));
        bcrypt.hash((this as any).password, salt, undefined, (err: mongoose.Error, hash: string) => {
            if (err)
                return next(createError(403));
            (this as any).password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword: string, next: Function) {
    bcrypt.compare(candidatePassword, (this as any).password, (err: mongoose.Error, isMatch: boolean) => {
        next(err, isMatch);
    });
};

userSchema.methods.findImages = function () {
    return Image.find({ author: this._id }, null, { sort: { createdAt: -1 } }).populate("mentions author comments likes").populate({ path: 'comments', populate: { path: 'author' } });
}

userSchema.methods.findNotification = function () {
    return Notification.find({ to: this._id }, null, { sort: { createdAt: -1 } }).populate("to from image");
}

userSchema.methods.deleteNotifications = function (notifications: any) {
    notifications = Promise.all(
        notifications.map(
            async (notif: any) => await Notification.findOneAndDelete({ _id: notif._id, to: this._id })
        )
    );
}

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

export default mongoose.model("User", userSchema);
