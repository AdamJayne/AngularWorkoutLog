(function(){
	angular.module('workoutlog')
		.service('UserService', [
			'$http', 'API_BASE', 'SessionToken', 'CurrentUser', 
			function($http, API_BASE, SessionToken, CurrentUser){
				function UserService(){

				}
				UserService.prototype.create = function(user) {
					var userPromise = $http.post(API_BASE + 'user', {
						user: user
					});
					userPromise.then(function(response){
						SessionToken.set(response.data.sessionToken);
						CurrentUser.set(response.data.user);
					});
					return userPromise;
				};
				UserService.prototype.login = function(user) {
					var loginPromise = $http.post(API_BASE + 'login', {
						user: user
					});
					loginPromise.then(function(response){
						SessionToken.set(response.data.sessionToken);
						CurrentUser.set(response.data.user);
					});
					return loginPromise;
				};
				return new UserService();
			}]);
})();