const mongoose = require('mongoose');
// const gameSchema = require('../models/leagueGame');
const leagueUserSchema = require('../models/valorantUser');
require('dotenv').config()

//This file will take on the role of handling the league db connections

console.log(process.env.CHL_DB_URI)
mongoose.connect(process.env.CHL_DB_URI);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));



// USERS DATA

const users = mongoose.model('ValUsers');


async function createUser(name, tag, puuid, region, level, title, card) {
    var user = await readUser(name, tag, puuid);
    if (user) {
        return {};
    } else {
        // console.log('new user before ', user)
        user = new users({
            name: name,
            tag: tag,
            puuid: puuid,
            region: region,
            level: parseInt(level, 10),
            title: title,
            card: card
        })
        user.save().catch((err) => {
            if (err) {
                console.error.bind('err');
            }
        });
    }
    return user;
}

async function readUser(name, tag, puuid) {
    var foundUser = await users.findOne({
        $or: [
            { name: name, tag: tag },
            { puuid: puuid }
        ]
    }).exec().then((user) => {
        console.log("Found user: ", user)
        return user
    });

    return foundUser;
}

//Little note: there's a chance, calling the user into a new var is a pass by value
async function updateUser(name, tag, puuid, level, title, card) {
    var user = await readUser(name, tag, puuid);
    // console.log('update user before update ', user)
    if (user) {
        user.name = name;
        user.tag = tag;
        user.level = parseInt(level, 10);
        user.title = title;
        user.card = card;
        await user.save().catch((err) => {
            if (err) {
                console.error.bind('err');
            }
        });
        // console.log('update user after update ', user)
    }
    return user;
}

function deleteUser(puuid) {
    var user = readUser("", "", puuid);
    if (user) {
        users.deleteOne({ puuid: puuid }, err => {
            if (err) console.error(err);
        })
    }
}

module.exports = { createUser, readUser, updateUser, deleteUser }