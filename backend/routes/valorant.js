const handler = require('../handlers/henrikApiHandler');
const valDB = require('../handlers/valorantDBManager')


// ALL SAVED DATA
exports.getSavedUser = async (req, res) => {
    try {
        const user = await valDB.readUser(req.params.name, req.params.tag)
        if (user) {
            res.json(user)
        } else {
            res.status(404).send('Not Found')
        }
    } catch (error) {
        res.status(404).send('Not Found')
    }
}



// LIVE DATA
exports.getUser = async (req, res) => {
    console.log(req.params)
    try {
        await handler.getAccountByRiotID(req.params.name, req.params.tag)
            .then((user) => {
                console.log(user)
                res.json(user);
            })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
};

exports.getMatchesByName = async (req, res) => {
    try {
        await handler.getMatchesByName(req.params.name, req.params.tag)
            .then((games) => {
                console.log(games)
                res.json(games);
            })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

exports.getMatchByGameID = async (req, res) => {
    try {
        await handler.getMatchByGameID(req.params.id)
            .then((games) => {
                console.log(games)
                res.json(games);
            })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

exports.getLastMatch = async (req,res) => {
    try {
        await handler.getLastLiveMatch(req.params.name, req.params.tag)
            .then((games) => {
                console.log(games)
                res.json(games);
            })
            handler.fillMatchHistory(req.params.name, req.params.tag)
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }

}


exports.getLastCharacterPlayed = async (req, res) => {
    try {
        const user = await valDB.readLastCharacterPlayed(req.params.name, req.params.tag)
        if (user) {
            res.json(user)
        } else {
            res.status(404).send('Not Found')
        }
    } catch (error) {
        res.status(404).send('Not Found')
    }
}