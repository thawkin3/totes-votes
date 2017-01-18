(function() {

	var resultsController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// HIDE ALL CONTENT BY DEFAULT
		$scope.showResultsGraph = false;

		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotGetPoll = false;
		$scope.showErrorMessageCannotGetPollResults = false;
		$scope.showErrorMessageNoVotesYet = false;

		// INITIALIZE THE VARIABLE FOR THE C3 CHART
		$scope.chart;
		$scope.chartData;
		$scope.chartAxisFormat;

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
					// COUNTS
					$scope.xAxisLabelArray = ["x"];
					$scope.columnsLabelArray = ["Votes"];
					$scope.chartXAxis = $scope.xAxisLabelArray.concat($scope.poll.choices);
					$scope.chartVoteCounts = $scope.columnsLabelArray.concat($scope.poll.votes);
					$scope.chartVoteCountFormat = ",";

					// PERCENTAGES
					$scope.poll.votePercentages = [];
					for (var i = 0; i < $scope.poll.votes.length; i++) {
						$scope.poll.votePercentages.push(parseFloat($scope.poll.votes[i] / $scope.poll.totalVotes));
					}
					$scope.chartVotePercentages = $scope.columnsLabelArray.concat($scope.poll.votePercentages)
					$scope.chartVotePercentageFormat = "%,";

					// INITIALIZE THE DATA FORMAT TO COUNTS
					$scope.chartData = $scope.chartVoteCounts;
					$scope.chartAxisFormat = $scope.chartVoteCountFormat;

					$scope.chart = c3.generate({
					    bindto: '#chart',
					    size: {
					    	height: 400
					    },
					    color: {
					    	pattern: ['#d9edf7']
					    },
					    interaction: {
					      enabled: false
					    },
					    data: {
					    	x : 'x',
					        columns: [
					        	$scope.chartXAxis,
					        	$scope.chartData
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
				            	},
				            	tick: {
				            		format: d3.format($scope.chartAxisFormat)
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

		// TOGGLE DATA FORMAT
		$scope.changeDataFormat = function (format) {
			console.log(format);
			if (format == 'count') {
				$scope.chart.load({
					columns: [
						$scope.chartXAxis,
						$scope.chartVoteCounts
					]
				});
				$scope.chartData = $scope.chartVoteCounts;
				$scope.chartAxisFormat = $scope.chartVoteCountFormat;
				// $scope.chart.flush();
			} else if (format == 'percentage') {
				$scope.chart.load({
					columns: [
						$scope.chartXAxis,
						$scope.chartVotePercentages
					]
				});
				$scope.chartData = $scope.chartVotePercentages;
				$scope.chartAxisFormat = $scope.chartVotePercentageFormat;
				// $scope.chart.flush();
			}
			console.log($scope.chart);
			
		}

		// GET A SINGLE POLL FOR THAT USER
		$http.get('/api/v1/polls/' + $routeParams.username + '/' + $routeParams.pollId).then(getPollSuccess, getPollError);

	};

	resultsController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('resultsController', resultsController);

}());