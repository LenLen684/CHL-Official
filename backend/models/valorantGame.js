const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    date: Date,
    match_id: {
        type: String,
        reqire: true
    },
    map: {
        id: String,
        name: String
    },
    gamemode: {
        name: String,
        modetype: String
    },
    outcome: {
        winning_team: String,
        rounds: {
            won: Number,
            lost: Number
        }
    },
    players: [
        {
            puuid: String,
            name: String,
            tag: String,
            team: String,
            agent: {
                uuid: String,
                name: String
            },
            stats: {
                kills: Number,
                deaths: Number,
                assists: Number,
                damage: Number,
            },
            ability_casts: {
                signature: Number,
                ability1: Number,
                ability2: Number,
                ultimate: Number
            }
        }
    ]
});


mongoose.model('ValGame', gameSchema);