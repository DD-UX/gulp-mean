// =================================================================
// Get all the packages ============================================
// =================================================================
var mongoose = require("mongoose");

// =================================================================
// Set Form Schema =================================================
// =================================================================
var Schema = mongoose.Schema;

module.exports = mongoose.model("form", new Schema({
	'_id': Object,
    'timestamp': String,
    'name': String,
    'email': String,
    'location': String,
    'twitter_user': String,
    'comment': String
}));