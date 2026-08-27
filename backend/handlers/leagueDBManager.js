const mongoose = require('mongoose');
const gameSchema = require('../models/leagueGame');
const leagueUserSchema = require('../models/leagueUser');
const masterySchema = require('../models/leagueMastery');
require('dotenv').config()

//This file will take on the role of handling the league db connections

console.log(process.env.CHL_DB_URI)
mongoose.connect(process.env.CHL_DB_URI);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
// mongoose.connection.once('open');


// USERS DATA

const users = mongoose.model('LeagueUsers');


async function createUser(name, tag, puuid) {
    var user = await readUser(name, tag, puuid);
    if (user) {
        return {};
    } else {
        // console.log('new user before ', user)
        user = new users({
            name: name,
            tag: tag,
            puuid: puuid
        })
        // console.log('new user creation', user);
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
async function updateUser(name, tag, puuid) {
    var user = await readUser(name, tag, puuid);
    // console.log('update user before update ', user)
    if (user) {
        user.name = name;
        user.tag = tag;
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


// GAME DATA
// These will operate under the assumption we're filtering the data before saving
var games = mongoose.model('LeagueGames');

async function createGame(gameID, gameData) {
    var game = await readGame(gameID);
    if (game) {
        return;
    } else {
        game = new games({
            gameID: gameID,
            participantIDS: gameData.participantIDS,
            info: gameData.info
        })
        await game.save().catch((err) => {
            if (err) {
                console.error.bind('err');
            }
        })
    }

    return game;
}

async function createTempGame(gameID, puuid) {
    var game = await readGame(gameID);
    if (game) {
        return;
    } else {
        game = new games({
            gameID: gameID,
            participantIDS: [puuid]
        })
        await game.save().catch((err) => {
            if (err) {
                console.error.bind('err');
            }
        })
    }

    return game
}

async function readGame(gameID) {
    var foundGame = await games.findOne({ gameID: gameID })
        .exec().then((game) => {
            // console.log("Found game: ", game)
            return game
        });
    return foundGame;
}

async function updateGame(gameID, gameData) {
    var game = await readGame(gameID);
    if (game) {
        game.participantIDS = gameData.participantIDS
        game.info = gameData.info

        await game.save().catch((err) => {
            if (err) {
                console.error.bind('err');
            }
        })
    }
    return game
}

async function updateTempGame(gameID, puuid) {
    var game = await readGame(gameID);
    if (game) {
        if (!game.participantIDS.includes(puuid)) {
            game.participantIDS.push(puuid)
            console.log(game)
            await game.save().catch((err) => {
                if (err) {
                    console.error.bind('err');
                }
            })
        }
    }
    return game
}

function deleteGame(gameID) {
    var game = readGame(gameID);
    if (game) {
        game.deleteOne({ gameID: gameID }, err => {
            if (err) console.err(err);
        })
    }
}


// MASTERY DATA
var masteries = mongoose.model('LeagueMasteries');
async function createMastery(puuid, championID, championLevel, championPoints, milestoneGrades) {
    var dbMastery = await readMasteryByChampion(puuid, championID);
    if (dbMastery) {
        return dbMastery
    } else {
        var mastery = new masteries({
            puuid: puuid,
            championID: championID,
            championLevel: championLevel,
            championPoints: championPoints,
            milestoneGrades: milestoneGrades
        })
        await mastery.save().catch(err => {
            console.error(err)
        })

        return mastery;
    }
}

async function readMasteryByChampion(puuid, championID) {
    var foundMastery = await masteries.findOne({
        puuid: puuid,
        championID: championID
    }).exec().then(mastery => {
        return mastery;
    });
    return foundMastery
}

async function readMasteriesByID(puuid, count) {
    if (!count) {
        count = 3
    }
    var foundMasteries = await masteries.find({
        puuid: puuid
    }).exec().then(masteries => {
        return masteries.slice(0, count);
    });

    return foundMasteries;
}

async function updateMastery(puuid, championID, championLevel, championPoints, milestoneGrades) {
    var dbMastery = await readMasteryByChampion(puuid, championID);
    if (!dbMastery) {
        return {}
    } else {
        dbMastery.championLevel = championLevel;
        dbMastery.championPoints = championPoints;
        dbMastery.milestoneGrades = milestoneGrades;
        await dbMastery.save().catch((err) => {
            if (err) {
                console.error.bind('err');
            }
        })
    }
    return dbMastery;
}

module.exports = { createUser, readUser, updateUser, deleteUser, createGame, createTempGame, readGame, updateGame, updateTempGame, deleteGame, createMastery, readMasteryByChampion, readMasteriesByID, updateMastery };