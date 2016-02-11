var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema({
	name: String,
	players: Array,
	logo: String,
	symbol: String
})


module.exports = mongoose.model('team', Team)

