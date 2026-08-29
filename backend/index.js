const express = require('express');
const league = require('./routes/league');
const val = require('./routes/valorant')
const cors = require('cors');
const app = express();

require('dotenv').config()


console.log('Starting App');
// app.use(express.static(__dirname + '/public'));
app.use(cors());
// LEAGUE
{
    // ACCOUNT DATA
    app.get('/league/account-by-name/:name/:tag', (req, res) => league.getUser(req, res));
    app.get('/league/mastery-by-puuid/:puuid', (req, res) => league.getMasteryByID(req, res))
    app.get('/league/mastery-by-puuid/:puuid/:count', (req, res) => league.getMasteryByID(req, res))
    app.get('/league/mastery-by-name/:name/:tag', (req, res) => league.getMasteryByName(req, res))
    app.get('/league/mastery-by-name/:name/:tag/:count', (req, res) => league.getMasteryByName(req, res))

    // GAMES
    app.get('/league/games-by-name/:name/:tag', (req, res) => league.getRecentGamesByUser(req, res));
    app.get('/league/game-by-id/:gameID', (req, res) => league.getGameByID(req, res));
}

// VALORANT
{
    // ACCOUNT DATA
    app.get('/saved/valorant/account/:name/:tag', val.getSavedUser)
    app.get('/valorant/account-by-name/:name/:tag', val.getUser)

    // GAMES
    app.get('/valorant/last-game/:name/:tag', (req, res) => val.getLastMatch(req, res));
    app.get('/valorant/games-by-name/:name/:tag', (req, res) => val.getMatchesByName(req, res));
}
app.listen(8080, '127.0.0.1', () => console.log('Server running on port 8080'));