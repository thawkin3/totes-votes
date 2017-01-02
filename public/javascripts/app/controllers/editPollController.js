(function() {

	var editPollController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// GET THE CURRENT USER'S USERNAME
		// TODO: authenticate the correct user here
		$scope.username = "tylerh";

		// HIDE ALL CONTENT BY DEFAULT
		$scope.pollExists = false;

		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotGetPoll = false;
		$scope.showErrorMessageMissingQuestionText = false;
		$scope.showErrorMessageLessThanTwoChoices = false;

		// SUCCESS CALLBACK
		function getPollSuccess (response) {
			$scope.showErrorMessageCannotGetPolls = false;
			console.log(response);
			$scope.poll = response.data;
			console.log($scope.poll);
			if ($scope.poll.length == 0) {
				$scope.showErrorMessageCannotGetPoll = true;
				$scope.pollExists = false;
			} else {
				$scope.showErrorMessageCannotGetPoll = false;
				$scope.pollExists = true;

				// ADD CHOICE
				$scope.addChoice = function (index) {
					var numberOfChoices = $scope.poll.Choices.length + 1;
					$scope.poll.Choices.splice(index+1,0,"Answer Choice " + numberOfChoices);
					$scope.poll.Votes.splice(index+1,0,0);
				}

				// REMOVE CHOICE
				$scope.removeChoice = function (index) {
					if ($scope.poll.Choices.length > 1) {
						$scope.poll.Choices.splice(index,1);
						$scope.poll.Votes.splice(index+1,1);
					}
				}
			}
		}

		// ERROR CALLBACK
		function getPollError (response) {
			console.error("error in getting poll");
			$scope.showErrorMessageCannotGetPoll = true;
		}

		// SUCCESS CALLBACK
		function updatePollSuccess (response) {
			console.log(response.data);
			$location.path("/allPolls");
		}

		// ERROR CALLBACK
		function updatePollError (response) {
			console.error("error in updating poll");
			$scope.showErrorMessageCannotUpdatePoll = true;
		}

		// GET A SINGLE POLL FOR THAT USER
		$http.get('/api/v1/polls/' + $scope.username + '/' + $routeParams.pollId).then(getPollSuccess, getPollError);

		// UPDATE THE POLL WITH NEW INFO
		$scope.editPoll = function () {
			$http.put('/api/v1/polls/' + $scope.username + '/' + $routeParams.pollId,
				{
					Username: $scope.poll.Username,
					Question: $scope.poll.Question,
					Choices: $scope.poll.Choices,
					Votes: $scope.poll.Votes,
					TotalVotes: $scope.poll.TotalVotes,
					AllowNewChoices: $scope.poll.AllowNewChoices
				}
			).then(updatePollSuccess, updatePollError);
		}

		// VIEW POLL RESULTS
		$scope.viewResults = function (pollId) {
			$location.path('results/' + pollId);
		}

		// VOTE ON POLL
		$scope.vote = function (pollId) {
			$location.path('vote/' + pollId);
		}

	};

	editPollController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('editPollController', editPollController);

}());