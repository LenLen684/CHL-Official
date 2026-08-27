const mongoose = require('mongoose');

const leagueUserSchema = new mongoose.Schema({
    name: {
        type:String,
        reqire:true
    },
    tag: {
        type:String,
        reqire:true
    },
    puuid:  {
        type:String,
        reqire:true
    }
});

mongoose.model('LeagueUsers', leagueUserSchema);