const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    gameID: String,
    participantIDS: [String],
    info: {
        gameMode: String,
        participants: [{
            puuid: String,
            teamID: Number,
            championLevel: Number,
            championID: Number,
            championName: String,
            damageSelfMitigated: Number,
            deaths: Number,
            itemIDs: [Number],
            kills: Number,
            teamPosition: String,
            totalDamageDealtToChampions: Number,
            totalDamageTaken: Number,
            totalHeal: Number,
            totalMinionsKilled: Number,
        }],
        teams: [
            {
                bans:[Number],
                teamID: Number,
                win: Boolean
            }
        ]
    }
});

mongoose.model('Games', gameSchema)