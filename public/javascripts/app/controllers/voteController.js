(function() {
	var voteController = function ($scope, $routeParams, $http, $location) {
		// HIDE ALL CONTENT BY DEFAULT
		$scope.showPollVoteOptions = false;

		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageMissingOtherText = false;
		$scope.showErrorMessageCannotGetPoll = false;
		$scope.showErrorMessageCannotVoteOnPoll = false;

		// SUCCESS CALLBACK
		function getPollSuccess (response) {
			$scope.showErrorMessageCannotGetPoll = false;
			$scope.poll = response.data;
			if ($scope.poll.length === 0) {
				$scope.showErrorMessageCannotGetPoll = true;
			} else {
				$scope.showPollVoteOptions = true;

				// VOTE FOR A CHOICE
				$scope.voteForChoice = function (index) {
					$scope.selectedChoice = index;
				}
			}
		}

		// ERROR CALLBACK
		function getPollError (response) {
			$scope.showErrorMessageCannotGetPoll = true;
		}

		// SUCCESS CALLBACK
		function voteOnPollSuccess (response) {
			$location.path('/results/' + $routeParams.username + '/' + $routeParams.pollId);
		}

		// ERROR CALLBACK
		function voteOnPollError (response) {
			$scope.showErrorMessageCannotVoteOnPoll = true;
		}

		// GET A SINGLE POLL FOR THAT USER
		$http.get('/api/v1/polls/' + $routeParams.username + '/' + $routeParams.pollId).then(getPollSuccess, getPollError);

		// VOTE ON THE POLL
		$scope.voteOnPoll = function (selectedChoice) {
			$scope.showErrorMessageMissingOtherText = false;
			if (selectedChoice != -99 && selectedChoice !== undefined) {
				$scope.poll.votes[selectedChoice]++;
				$scope.poll.totalVotes++;

				$http.put('/api/v1/polls/' + $routeParams.username + '/' + $routeParams.pollId,
					{
						votes: $scope.poll.votes,
						totalVotes: $scope.poll.totalVotes
					}
				).then(voteOnPollSuccess, voteOnPollError);
			} else if (selectedChoice == -99 && $scope.poll.allowNewChoices) {
				if (!$scope.otherTextEntry) {
					$scope.showErrorMessageMissingOtherText = true;
				} else {
					$scope.poll.choices.push($scope.otherTextEntry);
					$scope.poll.votes.push(1);
					$scope.poll.totalVotes++;

					$http.put('/api/v1/polls/' + $routeParams.username + '/' + $routeParams.pollId,
						{
							choices: $scope.poll.choices,
							votes: $scope.poll.votes,
							totalVotes: $scope.poll.totalVotes
						}
					).then(voteOnPollSuccess, voteOnPollError);
				}
			}
		}
	};

	voteController.$inject = ['$scope', '$routeParams', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('voteController', voteController);
}());
