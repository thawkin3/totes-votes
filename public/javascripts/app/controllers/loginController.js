(function() {
	var loginController = function ($scope, $rootScope, $location, AuthService) {
		$scope.goToCreateAccount = function () {
			$location.path('/createAccount');
		}

		$scope.login = function () {

		    // initial values
		    $scope.error = false;
		    $scope.disabled = true;

		    // call login from service
		    AuthService.login($scope.username, $scope.password)
	        // handle success
	        .then(function () {
	        	$scope.error = false;
	        	$scope.errorMessage = '';
	        	$scope.disabled = false;
	        	$scope.username = '';
	        	$scope.password = '';
	        	$rootScope.isLoggedIn = AuthService.isLoggedIn();
	        	$rootScope.loggedInUser = AuthService.getUsername();
	        	$location.path('/home');
	        })
	        // handle error
	        .catch(function () {
	        	$scope.error = true;
	        	$scope.errorMessage = 'Invalid username and/or password';
	        	$scope.disabled = false;
	        	$scope.username = '';
	        	$scope.password = '';
	        });
		};
	};

	loginController.$inject = ['$scope', '$rootScope', '$location', 'AuthService'];

	angular.module('TotesVotes')
	    .controller('loginController', loginController);
}());
