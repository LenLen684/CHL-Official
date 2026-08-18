const express = require('express');
const league = require('./routes/league');
const cors = require('cors');
const app = express();

require('dotenv').config()


console.log('Starting App');
// app.use(express.static(__dirname + '/public'));
app.use(cors());
// LEAGUE
{
    // ACCONT DATA
    app.get('/riot/account-by-name/:name/:tag', (req, res) => league.getUser(req, res));
    app.get('/league/mastery-by-puuid/:puuid', (req, res) => league.getMasteryByID(req, res))
    app.get('/league/mastery-by-puuid/:puuid/:count', (req, res) => league.getMasteryByID(req, res))
    app.get('/league/mastery-by-name/:name/:tag', (req, res) => league.getMasteryByName(req, res))
    app.get('/league/mastery-by-name/:name/:tag/:count', (req, res) => league.getMasteryByName(req, res))

    // GAMES
    app.get('/league/games-by-name/:name/:tag', (req, res) => league.getRecentGamesByUser(req, res));
    app.get('/league/game-by-id/:gameID', (req, res) => league.getGameByID(req, res));
}
app.listen(8080, '127.0.0.1', () => console.log('Server running on port 8080'));