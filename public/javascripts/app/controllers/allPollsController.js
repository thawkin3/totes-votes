(function() {
	var allPollsController = function ($scope, $rootScope, $http, $location) {
		// GET THE CURRENT USER'S USERNAME
		$scope.username = $rootScope.loggedInUser;

		// HIDE ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotGetPolls = false;
		$scope.showErrorMessageCannotDeletePoll = false;

		// HIDE ALL CONTENT BY DEFAULT
		$scope.showNoPollsMessage = false;
		$scope.showPollsTable = false;

		// DEFAULT SORT VALUES
		$scope.sortPollsBy = 'question';
		$scope.sortReverse = false;
		$scope.searchText = '';

		// SUCCESS CALLBACK
		function getAllPollsSuccess (response) {
			$scope.showErrorMessageCannotGetPolls = false;
			$scope.allPolls = response.data;
			if ($scope.allPolls.length == 0) {
				$scope.showNoPollsMessage = true;
				$scope.showPollsTable = false;
			} else {
				$scope.showNoPollsMessage = false;
				$scope.showPollsTable = true;
			}
		}

		// DELETE ERROR CALLBACK
		function getAllPollsError (response) {
			$scope.showErrorMessageCannotGetPolls = true;
		}

		// DELETE SUCCESS CALLBACK
		function deletePollSuccess (response) {
			$scope.showErrorMessageCannotDeletePoll = false;
			$http.get('/api/v1/polls/' + $scope.username).then(getAllPollsSuccess, getAllPollsError);
		}

		// ERROR CALLBACK
		function deletePollError (response) {
			$scope.showErrorMessageCannotDeletePoll = true;
		}

		// GET ALL THE POLLS FOR THAT USER
		$http.get('/api/v1/polls/' + $scope.username).then(getAllPollsSuccess, getAllPollsError);

		// EDIT POLL
		$scope.editPoll = function (pollId) {
			$location.path('edit/' + $scope.username + '/' + pollId);
		}

		// VIEW POLL RESULTS
		$scope.viewResults = function (pollId) {
			$location.path('results/' + $scope.username + '/' + pollId);
		}

		// VOTE ON POLL
		$scope.vote = function (pollId) {
			$location.path('vote/' + $scope.username + '/' + pollId);
		}

		// DELETE POLL
		$scope.delete = function (pollId) {
			$http.delete('/api/v1/polls/' + $scope.username + '/' + pollId).then(deletePollSuccess, deletePollError);
		}

		// CREATE A NEW POLL
		$scope.getStarted = function () {
			$location.path('/createPoll');
		}

		// POLLS TABLE SORTING
		$scope.changeSort = function (sortName) {
			if ($scope.sortPollsBy == sortName) {
				$scope.sortReverse = !$scope.sortReverse;
			} else {
				$scope.sortPollsBy = sortName;
				$scope.sortReverse = false;
			}
		}

		// POLLS TABLE FILTERING
		$scope.tableFilter = function (item, index) {
			if ($scope.searchText != '') {
				var searchString = $scope.searchText.toLowerCase();
				if (item.question.toLowerCase().indexOf(searchString) != -1) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		}
	};

	allPollsController.$inject = ['$scope', '$rootScope', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('allPollsController', allPollsController);
}());
