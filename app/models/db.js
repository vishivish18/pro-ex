/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mean_machine',function(){
	console.log('mongodb connected');
})

module.exports = mongoose;

*/
 

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds011268.mlab.com:11268/heroku_962lng9z', function() {
    console.log('mongodb connected on mongolab');
})
mongoose.connection.on('open', function(ref) {
    console.log('Connected to Mongo server...');
});

module.exports = mongoose;

