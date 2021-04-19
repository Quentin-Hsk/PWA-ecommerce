import * as mongoose from 'mongoose';

import Notification from '../models/notification';
import Comment from '../models/comment';
import Image from '../models/image';
import User from '../models/user';

export default async () => {
    console.log("Clearing database...");
    await mongoose.connection.dropDatabase();

    console.log("Creating user \"tester\"...");
    let user = await User.create([{
        alias: 'tester',
        firstName: 'Chester',
        lastName: 'Tester',
        password: 'chester',
        mail: 'chester@tester.com',
        phone: '+15552437837',
        avatarURL: 'https://www.rollingstone.com/wp-content/uploads/2018/06/chester-bennington-linkin-park-obit-a53cd0a0-c57a-484e-b0f6-e52173634d93.jpg',
    }, {
        alias: 'Jawad',
        firstName: 'Jawad',
        lastName: 'Bendaoud',
        password: 'jajadu69',
        mail: 'jawad.bendaoud@gmail.com',
        phone: '+14181187123',
        avatarURL: 'https://www.lamanchelibre.fr/photos/maxi/332407.jpg',
    }, {
        alias: 'Maitre Kebabier',
        firstName: 'Salade',
        lastName: 'Tommate',
        password: '123456',
        mail: 'Oignon@yahoo.fr',
        phone: '+15532469038',
        avatarURL: 'https://pbs.twimg.com/profile_images/1091795574272282625/0vL9kVfN_400x400.jpg',
    }, {
        alias: 'Le Pere Noel',
        firstName: 'Santa',
        lastName: 'Claus',
        password: '3630',
        mail: 'pere.noel@gmail.com',
        phone: '+12127187893',
        avatarURL: 'https://www.ina.fr/images_v2/200x150/PUB2786350130.jpeg',
    }, {
        alias: 'Jerem',
        firstName: 'jeremy',
        lastName: 'ferrari',
        password: 'admin',
        mail: 'jeremy.ferrari@gmail.com',
        phone: '+11281227678',
        avatarURL: 'https://remeng.rosselcdn.net/sites/default/files/dpistyles_v2/ena_16_9_extra_big/2019/05/30/node_68747/10595465/public/2019/05/30/B9719768524Z.1_20190530152432_000%2BGC3DNUC36.1-0.jpg?itok=g3253jdV1559469499',
    }]);

    console.log("Creating dank comments...");
    const comment = await Comment.create([
        { author: user[0], text: "J'aime me beurrer la biscotte." },
        { author: user[0], text: "À l'occasion, je vous mettrai un petit coup de polish..." },
        { author: user[1], text: "On me dit le plus grand bien des harengs pommes à l'huile ?" },
        { author: user[2], text: "Enfin ça fait un peu Jacques a dit a dit pas de charcuterie !" },
        { author: user[2], text: "Habile !" },
        { author: user[1], text: "Comment est votre blanquette ?" },
        { author: user[0], text: "Avant de partir sale espion, fais-moi l’amour !", createdAt: new Date('2018-07-11T13:34-0500') },
        { author: user[1], text: "Non je ne crois pas non", createdAt: new Date('2018-07-11T15:26-0500') },
        { author: user[0], text: "Pourquoi ?", createdAt: new Date('2018-07-11T15:27-0500') },
        { author: user[1], text: "Pas envie...", createdAt: new Date('2018-07-11T19:01-0500') }
    ]);
    
    console.log("Creating mock images...");
    const image = await Image.create([
        {author: user[0], source: 'https://i.redd.it/2d5yrneemrh41.jpg', description: '#FrogTree', keywords: ['frogs'], mentions: [user[0]],  comments: [comment[1]], miniature: 'https://i.imgur.com/vojDDMc.jpg'},
        {author: user[0], source: 'https://i.redd.it/v47yab5eaqh41.jpg', description: 'Squirrel tree frog or [...]', keywords: ['frogs'], miniature: 'https://i.imgur.com/WUjOzzI.jpg'},
        {createdAt: new Date('2018-08-08T12:25-0500'), author: user[0], source: 'https://static.boredpanda.com/blog/wp-content/uploads/2018/05/depositphotos_6288125-stock-photo-business-analyst__605.jpg', description: 'Why', keywords: ['no'], mentions: [user[0]], comments: [comment[4]], miniature: 'https://i.imgur.com/nG2aylF.jpg'},
        {author: user[0], source: 'https://static01.nyt.com/images/2019/05/19/world/17grumpycat-1/17grumpycat-1-videoSixteenByNine3000.jpg', description: 'rip tardar sauce', miniature: 'https://i.imgur.com/uPJFh1o.jpg'},
        {author: user[0], source: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjM3Njd9&w=1000&q=80', description: 'some landscape', keywords: ['landscape', 'photo'], miniature: 'https://i.imgur.com/Hp4cEnA.jpg'},
        {author: user[1], source: 'https://i.pinimg.com/600x315/3d/49/01/3d4901ebfca8cd5bc95e8fd42f1df2de.jpg', description: '#Meme', keywords: ['meme', 'jawad'], mentions: [user[2]], likes: [user[2]], miniature: 'https://i.imgur.com/DhBY82s.jpg'}, 
        {author: user[1], source: 'https://images7.memedroid.com/images/UPLOADED139/565232fe8e8e6.jpeg', description: '#Meme', keywords: ['jawad', 'meme', 'pokemon'], miniature: 'https://i.imgur.com/lgFUp2S.jpg'},
        {author: user[1], source: 'https://www.lamanchelibre.fr/photos/maxi/683921.jpg', description: '#PasContent', keywords: ['jawad'], miniature: 'https://i.imgur.com/iHOCuRv.jpg'},
        {author: user[1], source: 'https://i.ytimg.com/vi/saTvx-EXukM/hqdefault.jpg', keywords: ['jawad', 'meme'], comment: [comment[0]], miniature: 'https://i.imgur.com/QzpjBWn.jpg'},
        {author: user[2], source: 'https://i.ytimg.com/vi/xbNRLlxtadg/hqdefault.jpg', description: 'Un hotel? trivago', keywords: ['jawad', 'tribunal'], mentions: [user[1]], likes: [user[1]], miniature: 'https://i.imgur.com/tYoa9n2.jpg'},
        {author: user[2], source: 'https://www.francetvinfo.fr/image/74w5ajq8m-5e7d/1500/843/2986790.jpg', description: '#MaitreKebabier', keywords: ['kebab'], mentions: [user[0]], comments: comment[3], miniature: 'https://i.imgur.com/RyrFZ2d.jpg'},
        {author: user[2], source: 'https://s3-media0.fl.yelpcdn.com/bphoto/yjZshK2FLqNTaCLeeaFqKA/l.jpg', description: 'France Sweet France...\n#Kebab', keywords: ['kebab', "france"], likes: [user[0], user[1]],  comments: [comment[2], comment[5]], miniature: 'https://i.imgur.com/42gj6L3.jpg'},
        {author: user[2], source: 'https://i.ytimg.com/vi/e_0h9sZm0BM/maxresdefault.jpg', description: 'JE VEND SALADE TOMATE OIGNON KEBAB PAS CHER - GMOD SCP', keywords: ['kebab', 'salade', 'tommate', 'oignons'], miniature: 'https://i.imgur.com/LmbCUGK.jpg'},
        {createdAt: new Date('2018-07-11T13:34-0500'), author: user[2], source: 'https://www.echoduberry.fr/wp-content/uploads/2019/07/LC-Payv-Kebab-1024x683.jpg', description: 'Le nouveaux kebab est enfin la !', keywords: ['kebab', 'nouveau', 'mexikebab'], mentions: [user[2]], comments: [comment[6], comment[7], comment[8], comment[9]], likes: [user[2], user[0], user[1]], miniature: 'https://i.imgur.com/CMGBz3T.png'},
    ]);

    console.log("Creating fake notifications...");
    const notif = await Notification.create([
        { to: user[0], from: user[1], image: image[3], type: 0, text: "Santé, mais pas des pieds !" },
        { to: user[0], from: user[2], image: image[2], type: 1 },
    ]);

    console.log("All done, have a nice day!");
    process.exit(0);
};
