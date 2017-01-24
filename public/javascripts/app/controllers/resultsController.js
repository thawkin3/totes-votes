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
		$scope.selectedFormat = 'count';
		$scope.selectedChartType = 'bar';
		$scope.sortResultsBy = 'none';

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
					// BAR CHART COUNTS
					$scope.xAxisLabelArray = ["x"];
					$scope.columnsLabelArray = ["Votes"];
					$scope.chartXAxis = $scope.xAxisLabelArray.concat($scope.poll.choices);
					$scope.chartVoteCounts = $scope.columnsLabelArray.concat($scope.poll.votes);
					$scope.chartVoteCountFormat = ",";

					// BAR CHART PERCENTAGES
					$scope.poll.votePercentages = [];
					for (var i = 0; i < $scope.poll.votes.length; i++) {
						$scope.poll.votePercentages.push(parseFloat($scope.poll.votes[i] / $scope.poll.totalVotes));
					}
					$scope.chartVotePercentages = $scope.columnsLabelArray.concat($scope.poll.votePercentages)
					$scope.chartVotePercentageFormat = "%,";

					// PIE CHART COUNTS
					$scope.pieChartCounts = [];
					for (var i = 0; i < $scope.poll.votes.length; i++) {
						$scope.pieChartCounts.push([$scope.poll.choices[i], $scope.poll.votes[i]]);
					}
					console.log($scope.pieChartCounts);

					// INITIALIZE THE DATA FORMAT TO COUNTS
					$scope.chartData = $scope.chartVoteCounts;
					$scope.chartAxisFormat = $scope.chartVoteCountFormat;

					$scope.buildChart = function (chartType) {

						if (chartType == 'bar') {

							$scope.chart = c3.generate({
							    bindto: '#chart',
							    size: {
							    	height: 400
							    },
							    color: {
							    	pattern: ['#d9edf7']
							    },
							    interaction: {
							      enabled: true
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

						} else if (chartType == 'pie') {
							if ($scope.selectedFormat == 'count') {
								$scope.chart = c3.generate({
								    bindto: '#chart',
								    size: {
								    	height: 400
								    },
								    // color: {
								    // 	pattern: ['#d9edf7']
								    // },
								    interaction: {
								      enabled: true
								    },
								    data: {
								        columns: $scope.pieChartCounts,
								        type: 'pie'
								    },
								    pie: {
								    	label: {
						    	            format: function (value, ratio, id) {
						    	                return d3.format('')(value);
						    	            }
						    	        }
								    },
								    tooltip: {
								    	format: {
								        	value: function (value, ratio, id, index) { 
								        		return value;
								        	}
								    	}
								    }
								});
							} else if ($scope.selectedFormat == 'percentage') {
								$scope.chart = c3.generate({
								    bindto: '#chart',
								    size: {
								    	height: 400
								    },
								    // color: {
								    // 	pattern: ['#d9edf7']
								    // },
								    interaction: {
								      enabled: true
								    },
								    data: {
								        columns: $scope.pieChartCounts,
								        type: 'pie'
								    },
								    pie: {
								    	label: {
						    	            format: function (value, ratio, id) {
						    	                return d3.format(",.1%")(ratio);
						    	            }
						    	        }
								    }
								});
							}
						}

					}

					$scope.buildChart('bar');

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
			if (format == 'count') {
				$scope.selectedFormat = 'count';
				$scope.chartData = $scope.chartVoteCounts;
				$scope.chartAxisFormat = $scope.chartVoteCountFormat;
			} else if (format == 'percentage') {
				$scope.selectedFormat = 'percentage';
				$scope.chartData = $scope.chartVotePercentages;
				$scope.chartAxisFormat = $scope.chartVotePercentageFormat;
			}
			$scope.chart.flush();
			$scope.buildChart($scope.selectedChartType);
		}

		// TOGGLE CHART FORMAT
		$scope.changeChartFormat = function (format) {
			if (format == 'bar') {
				$scope.selectedChartType = 'bar';
			} else if (format == 'pie') {
				$scope.selectedChartType = 'pie';
			}
			$scope.chart.flush();
			$scope.buildChart($scope.selectedChartType);
		}

		// TOGGLE RESULTS SORTING
		$scope.sortResults = function (sortBy) {
			if (sortBy == 'none') {
				$scope.sortResultsBy = 'none';
			} else if (sortBy == 'alphabetical') {
				$scope.sortResultsBy = 'alphabetical';
			} else if (sortBy == 'number') {
				$scope.sortResultsBy = 'number';
			}
			$scope.chart.flush();
			$scope.buildChart($scope.selectedChartType);
		}

		// GET A SINGLE POLL FOR THAT USER
		$http.get('/api/v1/polls/' + $routeParams.username + '/' + $routeParams.pollId).then(getPollSuccess, getPollError);

	};

	resultsController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('TotesVotes')
	    .controller('resultsController', resultsController);

}());