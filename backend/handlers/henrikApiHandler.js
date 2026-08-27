const valorantDB = require('./valorantDBManager');

require('dotenv').config()

const API_Key = process.env.VAL_API_KEY;

var pastCallTimer = {
    lastCode: 200,
    recall: true
};

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
                "Authorization": API_Key
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

async function getAccountByRiotID(name, tag) {
    var account = await apiCall(`https://api.henrikdev.xyz/valorant/v2/account/${name}/${tag}`);
    //There's an issue here where we're not getting the user because of the lack of a PUUID, we'll use the one from riot if it exists
    const data = account.data
    var dbAccount = await valorantDB.readUser(name, tag, data.puuid);
    // console.log('account empty ', emptyObject(account), 'dbaccount empty ', emptyObject(dbAccount));
    // console.log('dbAccount', dbAccount)
    if (!emptyObject(account.data) && !emptyObject(dbAccount)) {
        console.log('Hit update user')
        dbAccount = await valorantDB.updateUser(data.gameName, data.tag, data.puuid, data.account_level, data.title, data.card);
    } else if (emptyObject(dbAccount) && !emptyObject(account.data)) {
        console.log('Hit create user')
        dbAccount = await valorantDB.createUser(data.gameName, data.tag, data.puuid, data.region, data.account_level, data.title, data.card);
    }
    return dbAccount;
}




// SUPPORT
//Takes in object and checks if data exists
function emptyObject(data) {
    if (data) {
        return Object.keys(data).length == 0;
    }
    return true;
}


module.exports = {getAccountByRiotID}