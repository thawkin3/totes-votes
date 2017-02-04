(function() {

	var navbarController = function ($scope, $rootScope, $location, AuthService) {

		$scope.logout = function () {

	    	// call logout from service
	    	AuthService.logout()
	        .then(function () {
	        	$rootScope.isLoggedIn = AuthService.isLoggedIn();
	        	$rootScope.loggedInUser = AuthService.getUsername();
	        	$location.path("/login");
	        });

	    };

	};

	navbarController.$inject = ['$scope', '$rootScope', '$location', 'AuthService'];

	angular.module('TotesVotes')
	    .controller('navbarController', navbarController);

}());