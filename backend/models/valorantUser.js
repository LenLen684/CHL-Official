const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    },
    region: String,
    level: Number,
    title: String,
    card: String
});

mongoose.model('ValUsers', userSchema);