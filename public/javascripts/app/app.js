var app = angular.module('TotesVotes', ['ngRoute']);

app.config(function ($routeProvider){
	$routeProvider
		.when('/', {
			redirectTo: '/allPolls',
			access: {restricted: true}
		})
		.when('/login', {
			controller: 'loginController',
			templateUrl:'javascripts/app/views/login.html',
			access: {restricted: false}
		})
		.when('/createAccount', {
			controller: 'createAccountController',
			templateUrl:'javascripts/app/views/createAccount.html',
			access: {restricted: false}
		})
		.when('/createPoll', {
			controller: 'createPollController',
			templateUrl:'javascripts/app/views/createPoll.html',
			access: {restricted: true}
		})
		.when('/allPolls', {
			controller: 'allPollsController',
			templateUrl:'javascripts/app/views/allPolls.html',
			access: {restricted: true}
		})
		.when('/vote/:username/:pollId', {
			controller: 'voteController',
			templateUrl:'javascripts/app/views/vote.html',
			access: {restricted: false}
		})
		.when('/edit/:username/:pollId', {
			controller: 'editPollController',
			templateUrl:'javascripts/app/views/editPoll.html',
			access: {restricted: true}
		})
		.when('/results/:username/:pollId', {
			controller: 'resultsController',
			templateUrl:'javascripts/app/views/results.html',
			access: {restricted: false}
		})
		.otherwise({ 
			redirectTo: '/allPolls',
			access: {restricted: true}
		});
});

app.run(function($rootScope, $location, $window, $route, AuthService) {
    // GOOGLE ANALYTICS ID
    $window.ga('create', 'UA-90393466-1', 'auto');

    // AUTHENTICATION
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
	    AuthService.getUserStatus()
	    .then(function () {
        	$rootScope.isLoggedIn = AuthService.isLoggedIn();
    		$rootScope.loggedInUser = AuthService.getUsername();
		    if (typeof next.access != 'undefined' && next.access.restricted && !AuthService.isLoggedIn()) {
    		// if (next.access.restricted && !AuthService.isLoggedIn()) {
    			$location.path('/login');
    			$route.reload();
    		}
    	});
    	
    });

	// GOOGLE ANALYTICS FOR EACH VIEW
	$rootScope.$on('$routeChangeSuccess', function (event) {
    	$window.ga('send', 'pageview', $location.path());
	});
});