(function() {

	var allPollsController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// GET THE CURRENT USER'S USERNAME
		$scope.username = $rootScope.loggedInUser;

		// HIDE ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotGetPolls = false;

		// HIDE ALL CONTENT BY DEFAULT
		$scope.showNoPollsMessage = false;
		$scope.showPollsTable = false;

		// SUCCESS CALLBACK
		function getAllPollsSuccess (response) {
			$scope.showErrorMessageCannotGetPolls = false;
			console.log(response);
			$scope.allPolls = response.data;
			console.log($scope.allPolls);
			if ($scope.allPolls.length == 0) {
				$scope.showNoPollsMessage = true;
			} else {
				$scope.showPollsTable = true;
			}
		}

		// ERROR CALLBACK
		function getAllPollsError (response) {
			console.error("error in getting polls");
			$scope.showErrorMessageCannotGetPolls = true;
		}

		// GET ALL THE POLLS FOR THAT USER
		$http.get('/api/v1/polls/' + $scope.username).then(getAllPollsSuccess, getAllPollsError);

		// EDIT POLL
		$scope.editPoll = function (pollId) {
			$location.path("edit/" + $scope.username + "/" + pollId);
		}

		// VIEW POLL RESULTS
		$scope.viewResults = function (pollId) {
			$location.path("results/" + $scope.username + "/" + pollId);
		}

		// VOTE ON POLL
		$scope.vote = function (pollId) {
			$location.path("vote/" + $scope.username + "/" + pollId);
		}

		// CREATE A NEW POLL
		$scope.getStarted = function () {
			$location.path("/createPoll");
		}
	};

	allPollsController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('allPollsController', allPollsController);

}());