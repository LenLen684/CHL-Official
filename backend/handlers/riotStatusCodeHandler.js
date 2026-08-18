const leagueDB = require('./leagueDBManager');

require('dotenv').config()

const API_Key = process.env.RIOT_API_KEY;

//Handles status codes and will hold the timer for api calls
//To handle when the api call has hit its limit, we can use setTimeout(function, timeInMS) and try again, but return data from MongoDB

// API STUFF
var pastCallTimer = {
    lastCode: 200,
    recall: true
};
var masteryRefresh = []


// THROWS ERROR
//400 - Bad Request

//401 - Unauthorized

//403 - Forbidden

//404 - Data not found

//405 - Method not allowed

//415 - Unsupported media type


// HANDLED WITH TIMERS
//429 - Rate limit exceeded MOST IMPORTANT ONE


//500 - Internal server error
//502 - Bad gateway
//504 - Gateway 
//If any of these are to be called, skip the calls, go straight to returning database data
//Make sure the request is just json of what needs to be sent through
//Check status codes, set timer if bad
function setTimer(res) {
    pastCallTimer.lastCode = res.status;
    if (res.ok) {
        pastCallTimer.recall = true;
        return;
    } else {
        pastCallTimer.recall = false;
    }
    console.log(res.status, res.statusText);

    switch (res.status) {
        case 429:
            setTimeout(() => {
                pastCallTimer.recall = true;
            }, 120000);
            break;
        case 400:
        case 401:
        case 403:
        case 404:
        case 405:
        case 415:
            console.error(`Call errors, code: ${res.status}`);
            pastCallTimer.recall = false;
            break;
        case 500:
        case 502:
        case 504:
            console.error(`Server errors, code: ${res.status}`)
            setTimeout(() => {
                pastCallTimer.recall = true;
            }, 300000);
            break;
        default:
            break;
    }
}

function apiCall(url, req) {
    if (pastCallTimer.lastCode == 200 || pastCallTimer.recall) {
        return fetch(url, {
            method: "GET",
            headers: {
                "X-Riot-Token": API_Key
            },
            body: req
        }).then(res => {
            setTimer(res);
            // console.log('Fetched data',res);
            return res.json()
        }).then(text => {
            // console.log('Jsonified content ', text)
            return text
        })
    } else {
        console.error('api call fail');
        return {};
    }
}

// CALLS
async function getAccountByRiotID(name, tag) {
    var account = await apiCall(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`);
    //There's an issue here where we're not getting the user because of the lack of a PUUID, we'll use the one from riot if it exists
    var dbAccount = await leagueDB.readUser(name, tag, account.puuid);
    // console.log('account empty ', emptyObject(account), 'dbaccount empty ', emptyObject(dbAccount));
    // console.log('dbAccount', dbAccount)
    if (!emptyObject(account) && !emptyObject(dbAccount)) {
        console.log('Hit update user')
        dbAccount = await leagueDB.updateUser(account.gameName, account.tagLine, account.puuid);
    } else if (emptyObject(dbAccount) && !emptyObject(account)) {
        console.log('Hit create user')
        dbAccount = await leagueDB.createUser(account.gameName, account.tagLine, account.puuid);
    }
    return dbAccount;
}

//Checks for riot account before calling for games if not found in db, calls for user ID first.
async function getGamesByRiotID(name, tag) {
    var dbAccount = await leagueDB.readUser(name, tag);
    if (!emptyObject(dbAccount)) {
        return getGamesByPUUID(dbAccount.puuid);
    } else {
        dbAccount = await getAccountByRiotID(name, tag);
        return await getGamesByPUUID(dbAccount.puuid);
    }
}

async function getGamesByPUUID(puuid) {
    var games = await apiCall(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`)
    //When we get this call back, we'll find just game IDs,
    //If we use the same database for games and the ids and such, we could save each id as a new entry, then populate it with data from
    //the Riot API we have to keep in mind how to connect this to the user we called for.
    //For example, we get the name and tag of the specified user, take that info, get the PUUID
    //Take that ID and look for games where the user is one of the participants.
    for (const gameID of games) {
        //Check if the game exists and actually has info
        var dbGame = await leagueDB.readGame(gameID);
        if (!emptyObject(dbGame)) {
            if (!dbGame.info.gameMode) {
                console.log("Update Game hit");
                leagueDB.updateTempGame(gameID, puuid);
            }
        } else {
            await leagueDB.createTempGame(gameID, puuid);
        }
    };
    return games
}

// Let's check for the game in the db first, if not, create a game from scratch
async function getGameInfoByID(gameID) {
    //Check for full game status in db first
    var dbGame = await leagueDB.readGame(gameID);
    if (!emptyObject(dbGame) && dbGame.info.gameMode) {
        return dbGame;
    } else {
        var game = await apiCall(`https://americas.api.riotgames.com/lol/match/v5/matches/${gameID}`);
        //Game parse data
        var filteredGame = gameDataFilter(game);
        //Call for db game status
        if (emptyObject(dbGame)) {
            //If the game is fully missing in db, create record in db
            dbGame = await leagueDB.createGame(gameID, filteredGame);
        } else {
            //Else if db record is incomplete, update existing, do not touch gameID string
            dbGame = await leagueDB.updateGame(gameID, filteredGame);
        }
    }
    return dbGame;
}

async function getMasteryByPUUID(puuid, count) {
    if (!count) {
        count = 3
    }
    var userQueued = masteryRefresh.find((id) => id == puuid)
    // console.log(masteryRefresh, userQueued)
    if (!userQueued) {
        var masteries = await apiCall(`https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=20`);
        masteryRefresh.push(puuid);
        setTimeout(() => {
            masteryRefresh.shift();
        }, 300000);

        for (mastery of masteries) {
            console.log(mastery.championId, 'CHAMPION ID')
            var dbMastery = await leagueDB.readMasteryByChampion(puuid, mastery.championId);
            if (!emptyObject(dbMastery)) {
                await leagueDB.updateMastery(puuid, mastery.championId, mastery.championLevel, mastery.championPoints, mastery.milestoneGrades);
            } else {
                await leagueDB.createMastery(puuid, mastery.championId, mastery.championLevel, mastery.championPoints, mastery.milestoneGrades);
            }
        }
        return masteries.slice(0, count)
    } else {
        var masteries = await leagueDB.readMasteriesByID(puuid, count);

        return masteries
    }
}

async function getMasteryByName(name, tag, count) {
    if (!count) {
        count = 3
    }
    var user = await leagueDB.readUser(name, tag);
    return getMasteryByPUUID(user.puuid, count);
}

// SUPPORT
//Takes in object and checks if data exists
function emptyObject(data) {
    if (data) {
        return Object.keys(data).length == 0;
    }
    return true;
}

function gameDataFilter(rawData) {
    var participantData = [];
    for (item of rawData.info.participants) {
        var participant = {
            puuid: item.puuid,
            teamID: item.teamId,
            championLevel: item.champLevel,
            championID: item.championId,
            championName: item.championName,
            damageSelfMitigated: item.damageSelfMitigated,
            deaths: item.deaths,
            itemIDs: [
                item.item0,
                item.item1,
                item.item2,
                item.item3,
                item.item4,
                item.item5,
                item.item6
            ],
            kills: item.kills,
            teamPosition: item.teamPosition,
            totalDamageDealtToChampions: item.totalDamageDealtToChampions,
            totalDamageTaken: item.totalDamageTaken,
            totalHeal: item.totalHeal,
            totalMinionsKilled: item.totalMinionsKilled
        }
        participantData.push(participant);
    }

    var teamsData = [];
    for (team of rawData.info.teams) {
        var team = {
            bans: team.bans,
            teamID: team.teamId,
            win: team.win
        }
    }

    var game = {
        participantIDS: rawData.metadata.participants,
        info: {
            gameMode: rawData.gameMode,
            participants: participantData,
            teams: teamsData
        }
    }
    return game;
}

module.exports = { getAccountByRiotID, getGamesByPUUID, getGamesByRiotID, getGameInfoByID, getMasteryByPUUID, getMasteryByName }