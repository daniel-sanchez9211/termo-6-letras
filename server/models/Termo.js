const mongoose = require('mongoose');

const TermoSchema = new mongoose.Schema({
    todaysWord: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    blackList: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Termo', TermoSchema);
