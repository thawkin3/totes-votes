(function() {
	var createAccountController = function ($scope, $http, $location, AuthService) {
		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageMissingUsername = false;
		$scope.showErrorMessageUsernameTaken = false;
		$scope.showErrorMessageMissingPassword = false;
		$scope.showErrorMessageNonMatchingPasswords = false;

		// SUCCESS CALLBACK
		function userCreationSuccess () {
    		$scope.error = false;
            $scope.errorMessage = '';
	        $scope.disabled = false;
        	$scope.username = '';
        	$scope.password = '';
	        $scope.passwordSecond = '';
			$location.path('/login');
		}

		// ERROR CALLBACK
		function userCreationError () {
			$scope.error = true;
	        $scope.errorMessage = 'Something went wrong!';
	        $scope.disabled = false;
	        $scope.username = '';
	        $scope.password = '';
	        $scope.passwordSecond = '';
			$scope.showErrorMessageUsernameTaken = true;
		}

		// VALIDATE IF A USER CAN BE CREATED WHEN THE FORM IS SUBMITTED
		// CREATE A USER IF YOU CAN
		$scope.createAccount = function () {
			$scope.showErrorMessageMissingUsername = false;
			$scope.showErrorMessageUsernameTaken = false;
			$scope.showErrorMessageMissingPassword = false;
			$scope.showErrorMessageNonMatchingPasswords = false;

			if ($scope.username == '' || $scope.username == undefined) {
				$scope.showErrorMessageMissingUsername = true;
			} else if ($scope.password == '' || $scope.password == undefined) {
				$scope.showErrorMessageMissingPassword = true;
			} else if ($scope.password != $scope.passwordSecond) {
				$scope.showErrorMessageNonMatchingPasswords = true;
			} else {
				// INITIAL VALUES
			    $scope.error = false;
			    $scope.disabled = true;

			    // CALL REGISTER FROM AUTHSERVICE
			    AuthService.register($scope.username, $scope.password)
			    .then(userCreationSuccess, userCreationError);
			}
		}
	};

	createAccountController.$inject = ['$scope', '$http', '$location', 'AuthService'];

	angular.module('TotesVotes')
	    .controller('createAccountController', createAccountController);
}());
