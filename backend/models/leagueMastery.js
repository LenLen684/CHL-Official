const mongoose = require('mongoose');

const masterySchema = mongoose.Schema({
    puuid: String,
    championID: Number,
    championLevel: Number,
    championPoints: Number,
    milestoneGrades: [String],
});

mongoose.model('Masteries', masterySchema)