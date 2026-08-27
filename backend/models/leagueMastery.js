const mongoose = require('mongoose');

const leagueMasterySchema = mongoose.Schema({
    puuid: String,
    championID: Number,
    championLevel: Number,
    championPoints: Number,
    milestoneGrades: [String],
});

mongoose.model('LeagueMasteries', leagueMasterySchema)