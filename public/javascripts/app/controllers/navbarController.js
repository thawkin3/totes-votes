(function() {

	var navbarController = function ($scope, $routeParams, $rootScope, $location, AuthService) {

		console.log($rootScope.isLoggedIn);
		console.log(AuthService.isLoggedIn());

		$scope.logout = function () {

	    	// call logout from service
	    	AuthService.logout()
	        .then(function () {
	        	console.log("logged out!");
	        	$rootScope.isLoggedIn = AuthService.isLoggedIn();
	        	$rootScope.loggedInUser = AuthService.getUsername();
	        	console.log($rootScope.isLoggedIn);
	        	console.log($rootScope.loggedInUser);
	        	$location.path("/login");
	        });

	    };

	};

	navbarController.$inject = ['$scope', '$routeParams', '$rootScope', '$location', 'AuthService'];

	angular.module('TotesVotes')
	    .controller('navbarController', navbarController);

}());