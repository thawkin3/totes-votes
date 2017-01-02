(function() {

	var homeController = function ($scope, $routeParams, $rootScope, $location) {

		$scope.getStarted = function () {
			$location.path("/createPoll");
		}

	};

	homeController.$inject = ['$scope', '$routeParams', '$rootScope', '$location'];

	angular.module('TotesVotes')
	    .controller('homeController', homeController);

}());