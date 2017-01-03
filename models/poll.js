var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// Defines the Poll Schema for this database
var pollSchema = mongoose.Schema({
  username: String,
  question: String,
  choices: Array,
  votes: Array,
  totalVotes: Number,
  allowNewChoices: Boolean
});

pollSchema.plugin(passportLocalMongoose);

// Makes an object from that schema as a model
module.exports = mongoose.model('Poll', pollSchema);