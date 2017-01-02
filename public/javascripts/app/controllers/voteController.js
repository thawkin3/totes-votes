(function() {

	var voteController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// GET THE CURRENT USER'S USERNAME
		// TODO: authenticate the correct user here
		$scope.username = "tylerh";

		// HIDE ALL CONTENT BY DEFAULT
		$scope.showPollVoteOptions = false;

		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotGetPoll = false;
		$scope.showErrorMessageCannotVoteOnPoll = false;

		// SUCCESS CALLBACK
		function getPollSuccess (response) {
			$scope.showErrorMessageCannotGetPoll = false;
			console.log(response);
			$scope.poll = response.data;
			console.log($scope.poll);
			if ($scope.poll.length == 0) {
				$scope.showErrorMessageCannotGetPoll = true;
			} else {
				$scope.showPollVoteOptions = true;

				// VOTE FOR A CHOICE
				$scope.voteForChoice = function (index) {
					$scope.selectedChoice = index;
					console.log("voted for choice " + index);
				}
			}
		}

		// ERROR CALLBACK
		function getPollError (response) {
			console.error("error in getting poll");
			$scope.showErrorMessageCannotGetPoll = true;
		}

		// SUCCESS CALLBACK
		function voteOnPollSuccess (response) {
			console.log(response.data);
			$location.path("/results/" + $routeParams.pollId);
		}

		// ERROR CALLBACK
		function voteOnPollError (response) {
			console.error("error in voting on poll");
			$scope.showErrorMessageCannotVoteOnPoll = true;
		}

		// GET A SINGLE POLL FOR THAT USER
		$http.get('/api/v1/polls/' + $scope.username + '/' + $routeParams.pollId).then(getPollSuccess, getPollError);

		// VOTE ON THE POLL
		$scope.voteOnPoll = function (selectedChoice) {
			$scope.poll.Votes[selectedChoice]++;
			$scope.poll.TotalVotes++;

			$http.put('/api/v1/polls/' + $scope.username + '/' + $routeParams.pollId,
				{
					Votes: $scope.poll.Votes,
					TotalVotes: $scope.poll.TotalVotes
				}
			).then(voteOnPollSuccess, voteOnPollError);
		}

	};

	voteController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('voteController', voteController);

}());