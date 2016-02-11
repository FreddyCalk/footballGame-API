var express = require('express');
var passport = require('passport');
var router = express.Router();
var Account = require('../models/account.js');
var Team = require('../models/team.js');

/* GET home page. */
router.get('/', function (req,res,next){
	res.render('index',{title: 'Football API Home'})
})

router.get('/teams', function (req, res, next) {
	Team.find({}, function (err, doc, next){
  		res.json(doc);
	})
});

router.post('/player-teams', function(req,res,next){
	Account.find({username: req.body.username}, function(err, doc){
		res.json({status: 'success', docs: doc})
	})
})

router.post('/edit-player', function(req,res,next){
	Account.findOneAndUpdate({username: req.body.username},{teams:req.body.teams}, function (err, doc){
		if(err){
			return res.json({status:'failed to update players', error: err})
		}else{
			return res.json({status: 'success', teams: doc.teams})
		}
	})
})

router.post('/updateFavoriteTeam', function (req, res, next){
	Account.findOneAndUpdate({username: req.body.username},{favoriteTeam:req.body.favoriteTeam}, function (err, doc) {
		if(err){
			return res.json({status:'failure on find', error: err})
		}else{
			Team.findOne({name:req.body.favoriteTeam}, function(err, team){
				if(!err){
					return res.json({status: 'success', favTeam: team})		
				}
			})
		}
	})
});

router.post('/signup', function (req, res, next){
	console.log(req.body)
	if(!req.body.favoriteTeam){
		return res.json({status: 'fail', message: 'You must select a favorite team'})
	}
	if(req.body.password === req.body.confirmPassword){
		Team.find({}, function(err, teams){
			Account.register(new Account({ username : req.body.username, favoriteTeam: req.body.favoriteTeam, teams: teams}), req.body.password, function (err, account){
				console.log(err)
				if(err){
					return res.json({status: err.name, message: err.message})
				}
				passport.authenticate('local')(req, res, function(){
					Team.findOne({name: req.body.favoriteTeam}, function (err, doc){
						return res.json({status: 'success', username: req.body.username, favTeam : doc})
						
					})
				})
			})
		})
	}else if(req.body.password !== req.body.confirmPassword){
		res.json({status: "fail", message: 'Your Passwords do not match'})		
	}
})


router.post('/login', passport.authenticate('local'), function (req, res){
		console.log(res);
		if(!req.user){
			return res.json({status: 'failure'})
		}
		if(req.user){
			console.log(req.user)
			Account.findOne({username: req.user.username}, function (err, user){
				Team.findOne({name: user.favoriteTeam}, function (err, doc){
					console.log(doc)
					return res.json({status:'success', username: req.user.username, favTeam: doc})	
				})
			})
		}
	})

module.exports = router;
