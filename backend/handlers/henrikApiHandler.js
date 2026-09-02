const valorantDB = require('./valorantDBManager');

require('dotenv').config()

const API_Key = process.env.VAL_API_KEY;

var pastCallTimer = {
    lastCode: 200,
    recall: true
};

function setTimer(res) {
    pastCallTimer.lastCode = res.status;
}

function apiCall(url, req) {
    if (pastCallTimer.lastCode == 200 || pastCallTimer.recall) {
        return fetch(url, {
            method: "GET",
            headers: {
                "Authorization": API_Key
            },
            body: req
        }).then(res => {
            if (res.ok) {
                setTimer(res);
                // console.log('Fetched data',res);
                return res.json()
            } else {
                return {}

            }
        }).then(text => {
            // console.log('Jsonified content ', text)
            return text
        })
    } else {
        console.error('api call fail');
        return {};
    }
}

async function getAccountByRiotID(name, tag) {
    var account = await apiCall(`https://api.henrikdev.xyz/valorant/v2/account/${name}/${tag}`);
    const data = account.data
    var dbAccount = await valorantDB.readUser(name, tag, data.puuid);
    if (!emptyObject(account.data) && !emptyObject(dbAccount)) {
        console.log('Hit update user')
        dbAccount = await valorantDB.updateUser(data.name, data.tag, data.puuid, data.account_level, data.title, data.card);
    } else if (emptyObject(dbAccount) && !emptyObject(account.data)) {
        console.log('Hit create user')
        // console.log()
        dbAccount = await valorantDB.createUser(data.name, data.tag, data.puuid, data.region, data.account_level, data.title, data.card);
    }
    return dbAccount;
}

async function getMatchesByName(name, tag, count) {
    let size = ''
    if (count) {
        size = `?size=${count}`
    }
    // Due to the nature of this call, the call must happen first.
    var matches = await apiCall(`https://api.henrikdev.xyz/valorant/v4/matches/na/pc/${name}/${tag}${size}`);
    // console.log(matches)
    var results = []

    for (let index = 0; index < matches.data.length; index++) {
        const match = matches.data[index];

        let gameID = match.metadata.match_id
        var dbGame = await valorantDB.readGame(gameID);
        if (!emptyObject(dbGame)) {
            console.log('Game Not empty')
            results.push(dbGame);
        } else {
            console.log('Game Empty')
            var filteredGame = gameDataFilter(match);
            dbGame = await valorantDB.createGame(gameID, filteredGame);
            results.push(dbGame);
        }
    };

    return results;
}


// If not careful, this could stop before fully populating, for now we'll make the call larger
async function fillMatchHistory(name, tag) {
    let size = `?size=5`
    let page = 0;
    let lastCalled = ''
    do {
        var matches = await apiCall(`https://api.henrikdev.xyz/valorant/v4/matches/na/pc/${name}/${tag}${size}&start=${page}`);
        console.log(matches)
        if (!emptyObject(matches)) {
            for (let index = 0; index < matches.data.length; index++) {
                const match = matches.data[index];
                let gameID = match.metadata.match_id
                var dbGame = await valorantDB.readGame(gameID);
                console.log(gameID)
                if (emptyObject(dbGame)) {
                    var filteredGame = gameDataFilter(match);
                    await valorantDB.createGame(gameID, filteredGame);
                }
                lastCalled = gameID
            };
            page += 1
        }
    } while (!valorantDB.readGame(lastCalled) || page < 3);
    console.log("Match history fill complete")
}

async function getLastLiveMatch(name, tag) {
    // Due to the nature of this call, the call must happen first.
    var matches = await apiCall(`https://api.henrikdev.xyz/valorant/v4/matches/na/pc/${name}/${tag}?size=1`);
    var results = []
    const match = matches.data[0];

    let gameID = match.metadata.match_id
    var dbGame = await valorantDB.readGame(gameID);
    if (!emptyObject(dbGame)) {
        console.log('Game Not empty')
        results.push(dbGame);
    } else {
        console.log('Game Empty')
        var filteredGame = gameDataFilter(match);
        dbGame = await valorantDB.createGame(gameID, filteredGame);
        results.push(dbGame);
        getMatchesByName(name, tag, 5)
    }
    return results
}

async function getMatchByGameID(id) {
    // Due to the nature of this call, the call must happen first.
    var matches = await apiCall(`https://api.henrikdev.xyz/valorant/v4/match/na/${id}`);
    var results = []
    const match = matches.data;

    let gameID = match.metadata.match_id
    var dbGame = await valorantDB.readGame(gameID);
    if (!emptyObject(dbGame)) {
        console.log('Game Not empty')
        results.push(dbGame);
    } else {
        console.log('Game Empty')
        var filteredGame = gameDataFilter(match);
        dbGame = await valorantDB.createGame(gameID, filteredGame);
        results.push(dbGame);
    }
    return results
}




// SUPPORT
//Takes in object and checks if data exists
function emptyObject(data) {
    if (data) {
        return Object.keys(data).length == 0;
    }
    return true;
}

// Take the raw Game data and filter only for the things we need
function gameDataFilter(rawData) {
    console.log(rawData.metadata.started_at)
    let players = []

    for (let index = 0; index < rawData.players.length; index++) {
        const p = rawData.players[index];

        let player = {
            puuid: p.puuid,
            name: p.name,
            tag: p.tag,
            team: p.team_id,
            agent: {
                uuid: p.agent.id,
                name: p.agent.name
            },
            stats: {
                kills: p.stats.kills,
                deaths: p.stats.deaths,
                assists: p.stats.assists,
                damage: p.stats.damage.dealt,
            },
            ability_casts: {
                signature: p.ability_casts.grenade,
                ability1: p.ability_casts.ability1,
                ability2: p.ability_casts.ability2,
                ultimate: p.ability_casts.ultimate
            }
        }
        players.push(player)
    }


    let outcome = {}
    for (let index = 0; index < rawData.players.length; index++) {
        const t = rawData.teams[index];

        if (t.won) {
            outcome = {
                winning_team: t.team_id,
                rounds: {
                    won: t.rounds.won,
                    lost: t.rounds.lost
                }
            }
            break;
        }
    }


    let game = {
        date: rawData.metadata.started_at,
        match_id: rawData.metadata.match_id,
        map: {
            id: rawData.metadata.map.id,
            name: rawData.metadata.map.name
        },
        gamemode: {
            name: rawData.metadata.queue.name,
            modetype: rawData.metadata.queue.mode_type
        },
        outcome: outcome,
        players: players
    }
    return game;
}


module.exports = { getAccountByRiotID, getMatchesByName, getLastLiveMatch, fillMatchHistory, getMatchByGameID }