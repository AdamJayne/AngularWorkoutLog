(function(){
	angular
		.module('workoutlog.auth.signup', ['ui.router'])
		.config(signupConfig);

		function signupConfig($stateProvider) {
			$stateProvider
				.state('signup', {
					url: '/signup',
					templateUrl: '/components/auth/signup.html',
					controller: SignUpController,
					controllerAs: 'ctrl',
					bindToController: this
				});
		};

		signupConfig.$inject = ['$stateProvider'];

		function SignUpController($state, UserService){
			var vm = this;
			vm.user = {};
			vm.message = "Sign up for an account!";
			vm.submit = function(){
				UserService.create(vm.user).then(function(response){
						console.log(response);
						$state.go('define');
				});
			};
		};

		SignUpController.$inject = ['$state', 'UserService'];
})();