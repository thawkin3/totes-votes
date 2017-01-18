(function() {

	var editPollController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// GET THE CURRENT USER'S USERNAME
		$scope.username = $rootScope.loggedInUser;

		// HIDE ALL CONTENT BY DEFAULT
		$scope.pollExists = false;

		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotGetPoll = false;
		$scope.showErrorMessageMissingQuestionText = false;
		$scope.showErrorMessageLessThanTwoChoices = false;
		$scope.showErrorMessageEmptyChoices = false;

		// SUCCESS CALLBACK
		function getPollSuccess (response) {
			$scope.showErrorMessageCannotGetPoll = false;
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
					var numberOfChoices = $scope.poll.choices.length + 1;
					$scope.poll.choices.splice(index+1,0,"Answer Choice " + numberOfChoices);
					$scope.poll.votes.splice(index+1,0,0);
				}

				// REMOVE CHOICE
				$scope.removeChoice = function (index) {
					if ($scope.poll.choices.length > 1) {
						$scope.poll.choices.splice(index,1);
						var decrementTotalVotesBy = $scope.poll.votes[index];
						$scope.poll.votes.splice(index,1);
						$scope.poll.totalVotes -= decrementTotalVotesBy;
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
			$scope.showErrorMessageMissingQuestionText = false;
			$scope.showErrorMessageLessThanTwoChoices = false;
			$scope.showErrorMessageEmptyChoices = false;

			if ($scope.poll.question == "" || $scope.poll.question == undefined) {
				$scope.showErrorMessageMissingQuestionText = true;
			} else if ($scope.poll.choices.length < 2) {
				$scope.showErrorMessageLessThanTwoChoices = true;
			} else if ($scope.poll.choices.indexOf("") != -1) {
				$scope.showErrorMessageEmptyChoices = true;
			} else {
				$http.put('/api/v1/polls/' + $scope.username + '/' + $routeParams.pollId,
					{
						username: $scope.poll.username,
						question: $scope.poll.question,
						choices: $scope.poll.choices,
						votes: $scope.poll.votes,
						totalVotes: $scope.poll.totalVotes,
						allowNewChoices: $scope.poll.allowNewChoices
					}
				).then(updatePollSuccess, updatePollError);
			}
		}

	};

	editPollController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('editPollController', editPollController);

}());