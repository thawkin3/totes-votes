(function() {

	var createAccountController = function ($scope, $routeParams, $rootScope, $http) {

		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageMissingUsername = false;
		$scope.showErrorMessageUsernameTaken = false;
		$scope.showErrorMessageMissingPassword = false;
		$scope.showErrorMessageNonMatchingPasswords = false;

		// SUCCESS CALLBACK
		function userCreationSuccess () {
			console.log("user created!");
			alert("user created!");
		}

		// ERROR CALLBACK
		function userCreationError () {
			console.log("username taken");
			$scope.showErrorMessageUsernameTaken = true;
		}

		// VALIDATE IF A USER CAN BE CREATED WHEN THE FORM IS SUBMITTED
		// CREATE A USER IF YOU CAN
		$scope.createAccount = function () {
			$scope.showErrorMessageMissingUsername = false;
			$scope.showErrorMessageUsernameTaken = false;
			$scope.showErrorMessageMissingPassword = false;
			$scope.showErrorMessageNonMatchingPasswords = false;

			if ($scope.username == "" || $scope.username == undefined) {
				console.log("please enter a username");
				$scope.showErrorMessageMissingUsername = true;
			} else if ($scope.password == "" || $scope.password == undefined) {
				console.log("please enter a password");
				$scope.showErrorMessageMissingPassword = true;
			} else if ($scope.password != $scope.passwordSecond) {
				console.log("passwords do not match");
				$scope.showErrorMessageNonMatchingPasswords = true;
			} else {
				$http.post('/api/v1/users/addUser',
					{
						Username: $scope.username,
						Password: $scope.password
					}
				).then(userCreationSuccess, userCreationError);
			}
		}

	};

	createAccountController.$inject = ['$scope', '$routeParams', '$rootScope', '$http'];

	angular.module('TotesVotes')
	    .controller('createAccountController', createAccountController);

}());