var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root:  'public' });
});

/* Set up mongoose in order to connect to mongo database */
// Adds mongoose as a usable dependency
var mongoose = require('mongoose');

// Connects to a mongo database called "totesVotesDB"
mongoose.connect('mongodb://localhost/totesVotesDB');

// Defines the User Schema for this database
var userSchema = mongoose.Schema({
  Username: String,
  Password: String
});

// Makes an object from that schema as a model
var User = mongoose.model('User', userSchema);

// Defines the Poll Schema for this database
var pollSchema = mongoose.Schema({
  Username: String,
  Question: String,
  Choices: Array,
  Votes: Array,
  TotalVotes: Number,
  AllowNewChoices: Boolean
});

// Makes an object from that schema as a model
var Poll = mongoose.model('Poll', pollSchema);

// Saves the connection as a variable to use
var db = mongoose.connection;
// Checks for connection errors
db.on('error', console.error.bind(console, 'connection error:'));
// Lets us know when we're connected
db.once('open', function() {
  console.log('Connected');
});

/* POST a user */
router.post('/api/v1/users/addUser', function(req, res, next) {
  console.log("POST adduser route");
  console.log(req.body);

  User.findOne({ Username: req.body.Username }, function(err, user) {
	  console.log(user);
	  if (user == null) {
		  var newUser = new User(req.body);
  	      console.log(newUser);
  	  	  console.log(req.body.Username);
		  newUser.save(true, function(err, post) {
		    if (err) return console.error(err);
		    console.log(post);
		    res.sendStatus(200);
		  });
	  } else {
	  	res.sendStatus(500);
	  }

  });
});


/* GET (fake POST) a user */
router.post('/api/v1/users/getUser', function(req, res, next) {
  console.log("POST users route");
  console.log(req.body);
  console.log(req.body.Username);

  User.findOne({ Username: req.body.Username }, function(err, user) {
	  console.log(user);
	  if (user !== null) {
		if (user.Password == req.body.Password) {
			console.log("found you!");
		    res.sendStatus(200);
		} else {
			res.sendStatus(403);
		}
	  } else {
		res.sendStatus(403);
	  }
  });
});

/* POST a new poll */
router.post('/api/v1/polls', function(req, res, next) {
  console.log("POST createpoll route");
  console.log(req.body);

  var newPoll = new Poll(req.body);
  console.log(newPoll);
  console.log(req.body.Poll);
  
  newPoll.save(true, function(err, post) {
    // if (err) return console.error(err);
    if (err) res.sendStatus(500);
    console.log(post);
    // res.sendStatus(200);
    res.json(post);
  });
});

/* GET all polls for a user */
router.get('/api/v1/polls/:username', function(req, res, next) {
	console.log("GET getpolls route");
	var query = Poll.find({ Username: req.params.username }).sort({ QuestionText: 1 });
	query.exec(function(err, polls) {
			// If there's an error, print it out
			// if (err) return console.error(err);
			if (err) {
				res.sendStatus(404);
			// Otherwise, return all the polls for that user
			} else {
			    res.json(polls);
			}

	});
});

/* GET a single poll for a user */
router.get('/api/v1/polls/:username/:pollId', function(req, res, next) {
	console.log("GET single getpolls route");
	var query = Poll.findOne({ Username: req.params.username, _id: req.params.pollId });
	query.exec(function(err, poll) {
			// If there's an error, print it out
			// if (err) return console.error(err);
			if (err) {
				res.sendStatus(404);
			// Otherwise, return the single poll for that user
			} else {
			    res.json(poll);
			}

	});
});

/* PUT a single poll for a user to update that poll */
/* ALSO */
/* PUT a single poll for a participant to vote on that poll */
router.put('/api/v1/polls/:username/:pollId', function(req, res, next) {
	console.log("PUT single getpolls route");
	var query = Poll.findOne({ Username: req.params.username, _id: req.params.pollId });
	query.exec(function(err, updatedPoll) {
			// If there's an error, print it out
			// if (err) return console.error(err);
			if (err) {
				res.sendStatus(404);
			// Otherwise, update the single poll for that user
			} else {
				if (req.body.Question != undefined) updatedPoll.Question = req.body.Question;
				if (req.body.Choices != undefined) updatedPoll.Choices = req.body.Choices;
				if (req.body.Username != undefined) updatedPoll.Username = req.body.Username;
				if (req.body.Votes != undefined) updatedPoll.Votes = req.body.Votes;
				if (req.body.TotalVotes != undefined) updatedPoll.TotalVotes = req.body.TotalVotes;
				if (req.body.AllowNewChoices != undefined) updatedPoll.AllowNewChoices = req.body.AllowNewChoices;
				updatedPoll.save(true, function(err, put) {
				    if (err) return console.error(err);
				    console.log(put);
				    res.sendStatus(200);
				});
			}

	});
});


module.exports = router;
