const handler = require('../handlers/henrikApiHandler');

exports.getUser = async (req, res) => {
  console.log(req.params)
  try{
      await handler.getAccountByRiotID(req.params.name, req.params.tag)
      .then((user) => {
          console.log(user)
          res.json(user);
        })
    }catch(error){
        res.status(500).send('Internal Server Error')
    }
};