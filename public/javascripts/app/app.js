var app = angular.module('TotesVotes', ['ngRoute']);

app.config(function ($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'homeController',
			templateUrl:'javascripts/app/views/home.html'
		})
		.when('/login', {
			controller: 'loginController',
			templateUrl:'javascripts/app/views/login.html'
		})
		.when('/createAccount', {
			controller: 'createAccountController',
			templateUrl:'javascripts/app/views/createAccount.html'
		})
		.when('/createPoll', {
			controller: 'createPollController',
			templateUrl:'javascripts/app/views/createPoll.html'
		})
		.when('/allPolls', {
			controller: 'allPollsController',
			templateUrl:'javascripts/app/views/allPolls.html'
		})
		.when('/vote/:pollId', {
			controller: 'voteController',
			templateUrl:'javascripts/app/views/vote.html'
		})
		.when('/edit/:pollId', {
			controller: 'editPollController',
			templateUrl:'javascripts/app/views/editPoll.html'
		})
		.when('/results/:pollId', {
			controller: 'resultsController',
			templateUrl:'javascripts/app/views/results.html'
		})
		.otherwise({ 
			redirectTo: '/' 
		});
});

app.run(function($rootScope) {
	$rootScope.user = "Guest";
});