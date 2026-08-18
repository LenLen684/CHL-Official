//Take all requests, and send it through the riot handler
const handler = require('../handlers/riotStatusCodeHandler');

async function getUser(req, res) {
  console.log(req.params)
  var user = await handler.getAccountByRiotID(req.params.name, req.params.tag)
    .then((user) => {
      console.log(user)
      res.json(user);
    })
};


async function getRecentGamesByUser(req, res) {
  console.log(req.params)
  //I would rather not have to do multiple calls here? We can restructure it so it calls for just the DB account
  var games = await handler.getGamesByRiotID(req.params.name, req.params.tag)
  // .then((games) => {
  //   console.log(games);
  // })
  res.json(games);
};

async function getGameByID(req, res) {
  var game = await handler.getGameInfoByID(req.params.gameID);
  res.json(game);
}

async function getMasteryByID(req,res) {
  res.json(await handler.getMasteryByPUUID(req.params.puuid, req.params.count))
}

async function getMasteryByName(req, res){
  var masteries = await handler.getMasteryByName(req.params.name, req.params.tag, req.params.count)
  res.json(masteries)
}

module.exports = { getUser, getRecentGamesByUser, getGameByID, getMasteryByID, getMasteryByName}