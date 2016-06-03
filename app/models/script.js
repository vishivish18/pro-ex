var db = require('./db')
var Script = db.model('Script', {
    url: {
        type: String
        
    },
    class: {
        type: String
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = Script
