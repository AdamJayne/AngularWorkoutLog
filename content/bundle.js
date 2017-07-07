(function() {
	var app = angular.module('workoutlog', [
			'ui.router'
		]);
		function config($urlRouterProvider){
			$urlRouterProvider.otherwise('/signin');
		};
		config.$inject = [ '$urlRouterProvider'];
		app.config(config);
		app.constant('API_BASE', '//localhost:3000/api');
})();


(function(){
	angular
		.module('workoutlog.auth.signup', ['ui.router'])
		.config(signupConfig);

		function signupConfig($stateProvider){
			$stateProvider
				.state('signup', {
					url: '/signup',
					templateUrl: '/components/auth/signup.html',
					controller: SignUpController,
					controllerAs: 'ctrl',
					bindToController: this
				});
		}

		signupConfig.$inject = ['$stateProvider'];

		function SignUpController($state, UserService) {
			var vm = this;
			vm.user = {};
			vm.message = "Sign up for an account!"
			vm.submit = function() {
				UserService.create(vm.user).then(function(response){
					$state.go('define')
				});
			};
		}

		SignUpController.$inject = ['$state', 'UserService'];
})();



(function(){
	angular.module('workoutlog')
		.factory('AuthInterceptor', ['SessionToken', 'API_BASE', 
			function(SessionToken, API_BASE) {
				return {
					request: function(config){
						var token = SessionToken.get();
						if (token && config.url.indexOf(API_BASE) > -1) {
							config.headers['Authorization'] = token;
						}
						return config;
					}
				}
			}]);
	angular.module('workoutlog')
		.config(['$httpProvider', function($httpProvider){
			return $httpProvider.interceptors.push('AuthInterceptor');
		}]);
})();
(function(){
	angular.module('workoutlog')
		.service('CurrentUser', ['$window', function($window){
			function CurrentUser(){
				var currUser = $window.localStorage.getItem('currentUser');
				if (currUser && currUser !== "undefined"){
					this.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
					}
				}
				CurrentUser.prototype.set = function(user) {
					this.currentUser = user;
					$window.localStorage.setItem('currentUser', JSON.stringify(user));
				};
				CurrentUser.prototype.get = function(){
					return this.currentUser || {};
				};
				CurrentUser.porototype.clear = function(){
					this.currentUser = undefined;
					$window.localStorage.removeItem('currentUser');
				};
				CurrentUser.prototype.isSignedIn = function(){
					return !!this.get().id;
				};
				return new CurrentUser();
		}]);
})();


(function(){
	angular.module('workoutlog')
		.service('SessionToken', ['$window', function($window){
			function SessionToken(){
				this.sessionToken = $window.localStorage.getItem('sessionToken');
			}

			SessionToken.prototype.set = function(token){
				this.sessionToken = token;
				$window.localStorage.setItem('sessionToken', token);
			};

			SessionToken.prototype.get = function(){
				return this.sessionToken;
			};

			SessionToken.prototype.clear = function(){
				this.SessionToken = undefined;
				$window.localStorage.removeItem('sessionToken');
			};
			return new SessionToken();
		}])
})
(function(){
	angular.module('workoutlog')
		.service('UsersService', [
			'$http' 'API_BASE', 'SessionToken', 'CurrentUser', 
			function($http, API_BASE, SessionToken, CurrentUser){
				function UsersService(){

				}
				UsersService.prototype.create = function(user){
					var userPromise = $http.post(API_BASE + 'user', {
						user : user
					});
					userPromise.then(function(response){ 
						SessionToken.set(response.data.sessionToken);
						CurrentUser.set(response.data.user);
					});
					return userPromise;
				};
				UsersService.prototype.login = function(user){
					var loginPromise = $http.post(API_BASE + 'login', {
						user: user
					});

					loginPromise.then(function(response){

						SessionToken.set(response.data.sessionToken);
						CurrentUser.set(response.data.user);
					});
					return loginPromise;
				};
				return new UsersService();
			}]);
})();
//# sourceMappingURL=bundle.js.map
