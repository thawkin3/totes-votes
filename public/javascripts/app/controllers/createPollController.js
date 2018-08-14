(function() {
	var createPollController = function ($scope, $rootScope, $http, $location) {
		// USERNAME
		$scope.username = $rootScope.loggedInUser;

		// INITIALIZE THE CHOICES ARRAY WITH TWO CHOICES
		$scope.choices = [
			'Answer Choice 1',
			'Answer Choice 2',
		];

		// INITIALIZE THE VOTES ARRAY WITH ZERO VOTES PER CHOICE
		$scope.votes = [0, 0];
		$scope.totalVotes = 0;

		// INITIALIZE THE 'ALLOW OTHER CHOICES' OPTION TO BE FALSE
		$scope.allowNewChoices = false;

		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageMissingQuestionText = false;
		$scope.showErrorMessageLessThanTwoChoices = false;
		$scope.showErrorMessageEmptyChoices = false;

		// ADD CHOICE
		$scope.addChoice = function (index) {
			var numberOfChoices = $scope.choices.length + 1;
			$scope.choices.splice(index + 1, 0, 'Answer Choice ' + numberOfChoices);
			$scope.votes.splice(index + 1, 0, 0);
		}

		// REMOVE CHOICE
		$scope.removeChoice = function (index) {
			if ($scope.choices.length > 1) {
				$scope.choices.splice(index, 1);
				$scope.votes.splice(index, 1);
			}
		}

		// MOVE CHOICE
		$scope.moveChoice = function (index, direction) {
			if (direction == 'up') {
				if (index > 0) {
					var movedChoice = $scope.choices.splice(index, 1)[0];
					var movedVote = $scope.votes.splice(index, 1)[0];
					$scope.choices.splice(index - 1, 0, movedChoice);
					$scope.votes.splice(index + 1, 0, movedVote);
				}
			} else if (direction == 'down') {
				if (index < $scope.choices.length - 1) {
					var movedChoice = $scope.choices.splice(index, 1)[0];
					var movedVote = $scope.votes.splice(index, 1)[0];
					$scope.choices.splice(index + 1, 0, movedChoice);
					$scope.votes.splice(index + 1, 0, movedVote);
				}
			}
		}

		// SUCCESS CALLBACK
		function pollCreationSuccess (response) {
			$location.path('/allPolls');
		}

		// ERROR CALLBACK
		function pollCreationError (response) {
			$scope.showErrorMessageUsernameTaken = true;
		}

		// VALIDATE THAT THE POLL HAS A QUESTION AND AT LEAST TWO ANSWER CHOICES
		// IF IT DOES, CREATE THE POLL AND RETURN THE POLL ID
		$scope.createPoll = function () {
			$scope.showErrorMessageMissingQuestionText = false;
			$scope.showErrorMessageLessThanTwoChoices = false;
			$scope.showErrorMessageEmptyChoices = false;

			if (!$scope.questionText) {
				$scope.showErrorMessageMissingQuestionText = true;
			} else if ($scope.choices.length < 2) {
				$scope.showErrorMessageLessThanTwoChoices = true;
			} else if ($scope.choices.indexOf('') !== -1) {
				$scope.showErrorMessageEmptyChoices = true;
			} else {
				$http.post('/api/v1/polls',
					{
						username: $scope.username,
						question: $scope.questionText,
						choices: $scope.choices,
						votes: $scope.votes,
						totalVotes: $scope.totalVotes,
						allowNewChoices: $scope.allowNewChoices,
					}
				).then(pollCreationSuccess, pollCreationError);
			}
		}
	};

	createPollController.$inject = ['$scope', '$rootScope', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('createPollController', createPollController);
}());
