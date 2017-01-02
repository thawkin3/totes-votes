(function() {

	var loginController = function ($scope, $routeParams, $rootScope, $location) {

		$scope.goToCreateAccount = function () {
			$location.path("/createAccount");
		}

	};

	loginController.$inject = ['$scope', '$routeParams', '$rootScope', '$location'];

	angular.module('TotesVotes')
	    .controller('loginController', loginController);

}());