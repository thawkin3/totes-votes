(function() {

	var resultsController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// HIDE ALL CONTENT BY DEFAULT
		$scope.showResultsGraph = false;

		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotGetPoll = false;
		$scope.showErrorMessageCannotGetPollResults = false;
		$scope.showErrorMessageNoVotesYet = false;

		// SUCCESS CALLBACK
		function getPollSuccess (response) {
			$scope.showErrorMessageCannotGetPoll = false;
			console.log(response);
			$scope.poll = response.data;
			console.log($scope.poll);
			if ($scope.poll.length == 0) {
				$scope.showErrorMessageCannotGetPoll = true;
			} else {
				if ($scope.poll.totalVotes == 0) {
					$scope.showErrorMessageNoVotesYet = true;
				} else {
					// SET UP YOUR DATA TO BE IN THE FORMAT WE NEED
					var xAxisLabelArray = ["x"];
					var columnsLabelArray = ["Votes"];
					var chartXAxis = xAxisLabelArray.concat($scope.poll.choices);
					var chartVotes = columnsLabelArray.concat($scope.poll.votes);

					$scope.poll.votePercentages = [];
					for (var i = 0; i < $scope.poll.votes.length; i++) {
						$scope.poll.votePercentages.push(parseFloat($scope.poll.votes[i] / $scope.poll.totalVotes));
					}
					var chartVotePercentages = columnsLabelArray.concat($scope.poll.votePercentages)


					var chart = c3.generate({
					    bindto: '#chart',
					    size: {
					    	height: 400
					    },
					    color: {
					    	pattern: ['#d9edf7']
					    	// pattern: ['#d9534f']
					    },
					    interaction: {
					      enabled: false
					    },
					    data: {
					    	x : 'x',
					        columns: [
					        	chartXAxis,
					        	chartVotes
					        ],
					        type: 'bar',
					        // empty: {
					        // 	label: {
					        //     	text: "No Data"
					        // 	}
				        	// }
					    },
					    legend: {
					    	hide: true
					    },
					    bar: {
					        width: {
					            ratio: 0.5
					        }
					    },
					    axis: {
				            x: {
				                type: 'category',
				                tick: {
	                                multiline: false,
	                                rotate: 0
	                            },
				            },
				            y: {
				            	min: 0,
				            	label: {
				            		text: 'Votes',
				            		position: 'inner-right'
				            	},
				            	padding: {
				            		bottom: 0,
				            		top: 20
				            	}
				            }
				        }
					});

					$scope.showResultsGraph = true;
				}
			}
		}

		// ERROR CALLBACK
		function getPollError (response) {
			console.error("error in getting poll");
			$scope.showErrorMessageCannotGetPoll = true;
		}

		// GET A SINGLE POLL FOR THAT USER
		$http.get('/api/v1/polls/' + $routeParams.username + '/' + $routeParams.pollId).then(getPollSuccess, getPollError);

	};

	resultsController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('resultsController', resultsController);

}());