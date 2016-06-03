angular.module('app',[
'ngRoute','ui.router'
])
angular.module('app')
    .controller('errorCtrl', ["$scope", "$rootScope", function($scope, $rootScope) {
        $scope.hello = "this is from the controller hello"
        console.log($scope.hello)



    }])

angular.module('app')
    .controller('homeCtrl', ["$scope", "$http", function($scope, $http) {

        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function() {
            var newWidth = 600 + slides.length + 1;
            slides.push({
                image: 'http://lorempixel.com/' + newWidth + '/300',
                text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
                id: currIndex++
            });
        };

        $scope.randomize = function() {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };

        for (var i = 0; i < 4; i++) {
            $scope.addSlide();
        }

        // Randomize logic below

        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].id = indexes.pop();
            }
        }

        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }

        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;

            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }

            return array;
        }



    }])

angular.module('app')
    .controller('loginCtrl', ["$scope", "auth", "$location", "$timeout", function($scope, auth, $location, $timeout) {
        $scope.authFail = false;
        $scope.login = function(username, password) {
            auth.login(username, password)
                .then(function(res) {
                    auth.storeToken(res.data, function() {
                        auth.getUser()
                            .then(function(res) {
                                auth.postLoginOps(res.data, function() {
                                    auth.postLoginRouteHandler();
                                });
                            })
                    });

                })
                .catch(function(response) {
                    console.error('Gists error', response.status, response.data);
                    if (response.status == 401) {
                        $scope.authFail = true
                        $timeout(function() { $scope.authFail = false; }, 3000);
                    }
                })
                .finally(function() {
                    console.log("finally finished gists");
                });


        }
    }])

angular.module('app')
    .controller('masterCtrl', ["$scope", "$rootScope", "$route", "$http", function($scope, $rootScope, $route, $http) {
        console.log("masterCtrl");

        if (localStorage.getItem('logged_user')) {        	
            $rootScope.currentUser = localStorage.getItem('logged_user')
            $http.defaults.headers.common['x-auth'] = localStorage.getItem('user_token')
            console.log(localStorage.getItem('user_token'))
        }
        $scope.$on('login', function(_, user) {
            console.log("Logged In");
            $scope.currentUser = user
            $rootScope.currentUser = user
            localStorage.setItem('logged_user', $rootScope.currentUser.username)
        })
    }])

angular.module('app')
    .controller('navCtrl', ["$scope", "auth", "$location", function($scope, auth, $location) {        
        $scope.logout = function() {            
            auth.logout()                

        }
    }])

angular.module('app')
    .controller('newDataCtrl', ["$scope", "$http", "$location", function($scope, $http, $location) {


        $scope.saveData = function() {
            console.log("save")
            $http.post('/api/data', {
                    field1: $scope.field1,
                    field2: $scope.field2,
                    field3: $scope.field3,
                    field4: $scope.field4
                })
                .then(function(response) {
                    console.log(response)
                }, function(response) {
                    console.log(response)
                });

        }



    }])

angular.module('app')
.controller('registerCtrl',["$scope", "auth", "$location", function($scope,auth,$location){
	$scope.register = function(name,username,password){
		auth.register(name,username,password)
		.then(function(response){			
			auth.login(username,password)
			$scope.$emit('login',response.data)
			$location.path('/home')
		})
		.catch(function (err){
			console.log(err)
		})
	}

}])

angular.module('app')
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: '/nav.html',
                        controller: 'navCtrl'
                    },
                    'content': {
                        templateUrl: '/home.html',
                        //controller: 'loginCtrl'
                    },
                    'footer': {
                        templateUrl: '/footer.html'

                    }
                }
            })

        .state('app.login', {
            url: 'login',
            views: {
                'header': {
                    templateUrl: '/nav.html',
                    controller: 'navCtrl'
                },
                'content': {
                    templateUrl: '/login.html',
                    controller: 'loginCtrl'

                }
            }
        })

        .state('app.register', {
            url: 'register',
            views: {
                'content@': {
                    templateUrl: 'register.html',
                    controller: 'registerCtrl'
                }
            }

        })

        .state('app.validate', {
            url: 'signup/validate/:id',

            views: {
                'content@': {
                    templateUrl: 'users/validate.html',
                    controller: 'validateCtrl'
                }
            }

        })


        .state('app.home', {
            url: 'home',
            views: {
                'content@': {
                    templateUrl: 'users/home.html',
                    controller: 'homeCtrl'
                }
            }

        })

        .state('app.home.data', {
            url: '/data/new',
            views: {
                'content@': {
                    templateUrl: 'users/newData.html',
                    controller: 'newDataCtrl'
                }
            }

        })

        .state('app.home.details', {
            url: '/vehicles/:id',

            views: {
                'content@': {
                    templateUrl: 'vehicles/editVehicle.html',
                    controller: 'VehiclesEditInfoCtrl'
                }
            }

        })

        .state('app.home.map', {
            url: '/vehicles/map/:id',

            views: {
                'content@': {
                    templateUrl: 'vehicles/mapVehicle.html',
                    controller: 'VehiclesEditMapCtrl'
                }
            }

        })




        $locationProvider.html5Mode(true)

    }]);

angular.module('app')
    .controller('validateCtrl', ["$scope", "$http", "$stateParams", function($scope, $http, $stateParams) {

        
        $scope.loading = true

        $http.get('api/users/validate/' + $stateParams.id)
            .then(function(res) {
                console.log(res)
                if(res.status == 200){
                	$scope.verified = true
                	$scope.loading = false
                }else{
                	$scope.verified = false
                	$scope.loading = false
                }

            })




    }])

angular.module('app')
    .service('auth', ["$http", "$window", "$location", "$rootScope", function($http, $window, $location, $rootScope) {


        return {
            getUser: getUser,
            login: login,
            register: register,
            logout: logout,
            storeToken: storeToken,
            isLogged: isLogged,
            postLoginOps: postLoginOps,
            postLoginRouteHandler: postLoginRouteHandler

        }

        function getUser() {
            return $http.get('api/users')
        }

        function login(username, password) {

            return $http.post('api/sessions', {
                username: username,
                password: password
            })
        }

        function register(name, username, password) {

             return $http.post('api/users', {
                name: name,
                username: username,
                password: password
            })
        }


        function logout() {
            localStorage.removeItem('user_token');
            localStorage.removeItem('logged_user');
            delete $http.defaults.headers.common['x-auth']
            $rootScope.isLogged = false;
            $rootScope.currentUser = null;
            $location.path("/login")



        }

        function storeToken(res, cb) {
            $window.sessionStorage["user_token"] = res
            localStorage.setItem('user_token', res);
            $http.defaults.headers.common['x-auth'] = $window.sessionStorage.user_token
            if (cb && (typeof cb === 'function')) {
                cb();
            }
        }

        function isLogged() {

        }

        function postLoginOps(res, cb) {

            
            $rootScope.currentUser = res.name
            localStorage.setItem('logged_user', $rootScope.currentUser)
            $rootScope.isLogged = true;
            if (cb && (typeof cb === 'function')) {
                cb();
            }
            
        }

        function postLoginRouteHandler() {
            if ($rootScope.intendedRoute) {
                $location.path($rootScope.intendedRoute);
            } else {
                $location.path('/home');
            }
        }
        

    }])


angular.module('app')
    .service('prognitor', ["$http", "$window", "$location", "$rootScope", function($http, $window, $location, $rootScope) {

        return {


            setSetupProcess: function($scope) {
                $scope.loading = false;
                console.log($scope)
                $scope.setup = function(callbackFn) {
                    if ($scope.loading) return;

                    $scope.loading = true;


                    $http.get($scope.apiUri)
                        .then(function(data) {
                            console.log(data)
                           /* $scope.state.lastPage = data.last_page;
                            $scope.isLastPage = ($scope.state.pageNum == $scope.state.lastPage);
                            $scope.loading = false;*/
                            if (callbackFn !== undefined)
                                callbackFn(data);
                        }, function(res) {
                            if (res.status == 404) {
                                $rootScope.$broadcast('render404');
                            }

                        });
                };
            },


            run: function($scope) {
                console.log("in prognitor service")
                this.setSetupProcess($scope);

            }
        }



    }])

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbnRyb2xsZXJzL2Vycm9yQ3RybC5qcyIsImNvbnRyb2xsZXJzL2hvbWVDdHJsLmpzIiwiY29udHJvbGxlcnMvbG9naW5DdHJsLmpzIiwiY29udHJvbGxlcnMvbWFzdGVyQ3RybC5qcyIsImNvbnRyb2xsZXJzL25hdkN0cmwuanMiLCJjb250cm9sbGVycy9uZXdEYXRhQ3RybC5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ3RybC5qcyIsImNvbnRyb2xsZXJzL3JvdXRlcy5qcyIsImNvbnRyb2xsZXJzL3ZhbGlkYXRlQ3RybC5qcyIsInNlcnZpY2VzL2F1dGguanMiLCJzZXJ2aWNlcy9wcm9nbml0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBQSxPQUFBLE1BQUE7QUFDQSxVQUFBOztBQ0RBLFFBQUEsT0FBQTtLQUNBLFdBQUEsc0NBQUEsU0FBQSxRQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7UUFDQSxRQUFBLElBQUEsT0FBQTs7Ozs7O0FDSEEsUUFBQSxPQUFBO0tBQ0EsV0FBQSxnQ0FBQSxTQUFBLFFBQUEsT0FBQTs7UUFFQSxPQUFBLGFBQUE7UUFDQSxPQUFBLGVBQUE7UUFDQSxPQUFBLFNBQUE7UUFDQSxJQUFBLFNBQUEsT0FBQSxTQUFBO1FBQ0EsSUFBQSxZQUFBOztRQUVBLE9BQUEsV0FBQSxXQUFBO1lBQ0EsSUFBQSxXQUFBLE1BQUEsT0FBQSxTQUFBO1lBQ0EsT0FBQSxLQUFBO2dCQUNBLE9BQUEsMkJBQUEsV0FBQTtnQkFDQSxNQUFBLENBQUEsY0FBQSxzQkFBQSxtQkFBQSxlQUFBLE9BQUEsU0FBQTtnQkFDQSxJQUFBOzs7O1FBSUEsT0FBQSxZQUFBLFdBQUE7WUFDQSxJQUFBLFVBQUE7WUFDQSx5QkFBQTs7O1FBR0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEdBQUEsS0FBQTtZQUNBLE9BQUE7Ozs7O1FBS0EsU0FBQSx5QkFBQSxTQUFBO1lBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFB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QSxPQUFBLFNBQUEsV0FBQSxZQUFBOzs7UUFHQSxPQUFBO1lBQ0EsU0FBQTtZQUNBLE9BQUE7WUFDQSxVQUFBO1lBQ0EsUUFBQTtZQUNBLFlBQUE7WUFDQSxVQUFBO1lBQ0EsY0FBQTtZQUNBLHVCQUFBOzs7O1FBSUEsU0FBQSxVQUFBO1lBQ0EsT0FBQSxNQUFBLElBQUE7OztRQUdBLFNBQUEsTUFBQSxVQUFBLFVBQUE7O1lBRUEsT0FBQSxNQUFBLEtBQUEsZ0JBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxVQUFBOzs7O1FBSUEsU0FBQSxTQUFBLE1BQUEsVUFBQSxVQUFBOzthQUVBLE9BQUEsTUFBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQSxVQUFBO2dCQUNBLFVBQUE7Ozs7O1FBS0EsU0FBQSxTQUFBO1lBQ0EsYUFBQSxXQUFBO1lBQ0EsYUFBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBLFNBQUEsUUFBQSxPQUFBO1lBQ0EsV0FBQSxXQUFBO1lBQ0EsV0FBQSxjQUFBO1lBQ0EsVUFBQSxLQUFBOzs7Ozs7UUFNQSxTQUFBLFdBQUEsS0FBQSxJQUFBO1lBQ0EsUUFBQSxlQUFBLGdCQUFBO1lBQ0EsYUFBQSxRQUFBLGNBQUE7WUFDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUEsUUFBQSxlQUFBO1lBQ0EsSUFBQSxPQUFBLE9BQUEsT0FBQSxhQUFBO2dCQUNBOzs7O1FBSUEsU0FBQSxXQUFBOzs7O1FBSUEsU0FBQSxhQUFBLEtBQUEsSUFBQTs7O1lBR0EsV0FBQSxjQUFBLElBQUE7WUFDQSxhQUFBLFFBQUEsZUFBQSxXQUFBO1lBQ0EsV0FBQSxXQUFBO1lBQ0EsSUFBQSxPQUFBLE9BQUEsT0FBQSxhQUFBO2dCQUNBOzs7OztRQUtBLFNBQUEsd0JBQUE7WUFDQSxJQUFBLFdBQUEsZUFBQTtnQkFDQSxVQUFBLEtBQUEsV0FBQTttQkFDQTtnQkFDQSxVQUFBLEtBQUE7Ozs7Ozs7O0FDOUVBLFFBQUEsT0FBQTtLQUNBLFFBQUEsNkRBQUEsU0FBQSxPQUFBLFNBQUEsV0FBQSxZQUFBOztRQUVBLE9BQUE7OztZQUdBLGlCQUFBLFNBQUEsUUFBQTtnQkFDQSxPQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLE9BQUEsUUFBQSxTQUFBLFlBQUE7b0JBQ0EsSUFBQSxPQUFBLFNBQUE7O29CQUVBLE9BQUEsVUFBQTs7O29CQUdBLE1BQUEsSUFBQSxPQUFBO3lCQUNBLEtBQUEsU0FBQSxNQUFBOzRCQUNBLFFBQUEsSUFBQTs7Ozs0QkFJQSxJQUFBLGVBQUE7Z0NBQ0EsV0FBQTsyQkFDQSxTQUFBLEtBQUE7NEJBQ0EsSUFBQSxJQUFBLFVBQUEsS0FBQTtnQ0FDQSxXQUFBLFdBQUE7Ozs7Ozs7O1lBUUEsS0FBQSxTQUFBLFFBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLEtBQUEsZ0JBQUE7Ozs7Ozs7O0FBUUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsW1xuJ25nUm91dGUnLCd1aS5yb3V0ZXInXG5dKSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdlcnJvckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLmhlbGxvID0gXCJ0aGlzIGlzIGZyb20gdGhlIGNvbnRyb2xsZXIgaGVsbG9cIlxuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuaGVsbG8pXG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdob21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHApIHtcblxuICAgICAgICAkc2NvcGUubXlJbnRlcnZhbCA9IDUwMDA7XG4gICAgICAgICRzY29wZS5ub1dyYXBTbGlkZXMgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmFjdGl2ZSA9IDA7XG4gICAgICAgIHZhciBzbGlkZXMgPSAkc2NvcGUuc2xpZGVzID0gW107XG4gICAgICAgIHZhciBjdXJySW5kZXggPSAwO1xuXG4gICAgICAgICRzY29wZS5hZGRTbGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG5ld1dpZHRoID0gNjAwICsgc2xpZGVzLmxlbmd0aCArIDE7XG4gICAgICAgICAgICBzbGlkZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vbG9yZW1waXhlbC5jb20vJyArIG5ld1dpZHRoICsgJy8zMDAnLFxuICAgICAgICAgICAgICAgIHRleHQ6IFsnTmljZSBpbWFnZScsICdBd2Vzb21lIHBob3RvZ3JhcGgnLCAnVGhhdCBpcyBzbyBjb29sJywgJ0kgbG92ZSB0aGF0J11bc2xpZGVzLmxlbmd0aCAlIDRdLFxuICAgICAgICAgICAgICAgIGlkOiBjdXJySW5kZXgrK1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnJhbmRvbWl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ZXMgPSBnZW5lcmF0ZUluZGV4ZXNBcnJheSgpO1xuICAgICAgICAgICAgYXNzaWduTmV3SW5kZXhlc1RvU2xpZGVzKGluZGV4ZXMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICAkc2NvcGUuYWRkU2xpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJhbmRvbWl6ZSBsb2dpYyBiZWxvd1xuXG4gICAgICAgIGZ1bmN0aW9uIGFzc2lnbk5ld0luZGV4ZXNUb1NsaWRlcyhpbmRleGVzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHNsaWRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzbGlkZXNbaV0uaWQgPSBpbmRleGVzLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVJbmRleGVzQXJyYXkoKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXhlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJySW5kZXg7ICsraSkge1xuICAgICAgICAgICAgICAgIGluZGV4ZXNbaV0gPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNodWZmbGUoaW5kZXhlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzk2MjgwMiM5NjI4OTBcbiAgICAgICAgZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xuICAgICAgICAgICAgdmFyIHRtcCwgY3VycmVudCwgdG9wID0gYXJyYXkubGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAodG9wKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKC0tdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodG9wICsgMSkpO1xuICAgICAgICAgICAgICAgICAgICB0bXAgPSBhcnJheVtjdXJyZW50XTtcbiAgICAgICAgICAgICAgICAgICAgYXJyYXlbY3VycmVudF0gPSBhcnJheVt0b3BdO1xuICAgICAgICAgICAgICAgICAgICBhcnJheVt0b3BdID0gdG1wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgICB9XG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdsb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGF1dGgsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcbiAgICAgICAgJHNjb3BlLmF1dGhGYWlsID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICAgICAgYXV0aC5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGF1dGguc3RvcmVUb2tlbihyZXMuZGF0YSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoLmdldFVzZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoLnBvc3RMb2dpbk9wcyhyZXMuZGF0YSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoLnBvc3RMb2dpblJvdXRlSGFuZGxlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0dpc3RzIGVycm9yJywgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5hdXRoRmFpbCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkgeyAkc2NvcGUuYXV0aEZhaWwgPSBmYWxzZTsgfSwgMzAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbmFsbHkgZmluaXNoZWQgZ2lzdHNcIik7XG4gICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdtYXN0ZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkcm91dGUsICRodHRwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibWFzdGVyQ3RybFwiKTtcblxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvZ2dlZF91c2VyJykpIHsgICAgICAgIFx0XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvZ2dlZF91c2VyJylcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyX3Rva2VuJylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyX3Rva2VuJykpXG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvZ2dlZCBJblwiKTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHVzZXJcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9nZ2VkX3VzZXInLCAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJuYW1lKVxuICAgICAgICB9KVxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignbmF2Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgYXV0aCwgJGxvY2F0aW9uKSB7ICAgICAgICBcbiAgICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCkgeyAgICAgICAgICAgIFxuICAgICAgICAgICAgYXV0aC5sb2dvdXQoKSAgICAgICAgICAgICAgICBcblxuICAgICAgICB9XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCduZXdEYXRhQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbikge1xuXG5cbiAgICAgICAgJHNjb3BlLnNhdmVEYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVcIilcbiAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvZGF0YScsIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQxOiAkc2NvcGUuZmllbGQxLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZDI6ICRzY29wZS5maWVsZDIsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkMzogJHNjb3BlLmZpZWxkMyxcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ0OiAkc2NvcGUuZmllbGQ0XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ3JlZ2lzdGVyQ3RybCcsZnVuY3Rpb24oJHNjb3BlLGF1dGgsJGxvY2F0aW9uKXtcblx0JHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24obmFtZSx1c2VybmFtZSxwYXNzd29yZCl7XG5cdFx0YXV0aC5yZWdpc3RlcihuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcdFx0XHRcblx0XHRcdGF1dGgubG9naW4odXNlcm5hbWUscGFzc3dvcmQpXG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvZ2luJyxyZXNwb25zZS5kYXRhKVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ob21lJylcblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycilcblx0XHR9KVxuXHR9XG5cbn0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmF2Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ25hdkN0cmwnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29udHJvbGxlcjogJ2xvZ2luQ3RybCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ2Zvb3Rlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2Zvb3Rlci5odG1sJ1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmxvZ2luJywge1xuICAgICAgICAgICAgdXJsOiAnbG9naW4nLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9uYXYuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICduYXZDdHJsJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbG9naW5DdHJsJ1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLnJlZ2lzdGVyJywge1xuICAgICAgICAgICAgdXJsOiAncmVnaXN0ZXInLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncmVnaXN0ZXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyZWdpc3RlckN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAudmFsaWRhdGUnLCB7XG4gICAgICAgICAgICB1cmw6ICdzaWdudXAvdmFsaWRhdGUvOmlkJyxcblxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndXNlcnMvdmFsaWRhdGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICd2YWxpZGF0ZUN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cblxuICAgICAgICAuc3RhdGUoJ2FwcC5ob21lJywge1xuICAgICAgICAgICAgdXJsOiAnaG9tZScsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250ZW50QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd1c2Vycy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAuaG9tZS5kYXRhJywge1xuICAgICAgICAgICAgdXJsOiAnL2RhdGEvbmV3JyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3VzZXJzL25ld0RhdGEuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICduZXdEYXRhQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5ob21lLmRldGFpbHMnLCB7XG4gICAgICAgICAgICB1cmw6ICcvdmVoaWNsZXMvOmlkJyxcblxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmVoaWNsZXMvZWRpdFZlaGljbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdWZWhpY2xlc0VkaXRJbmZvQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5ob21lLm1hcCcsIHtcbiAgICAgICAgICAgIHVybDogJy92ZWhpY2xlcy9tYXAvOmlkJyxcblxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmVoaWNsZXMvbWFwVmVoaWNsZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1ZlaGljbGVzRWRpdE1hcEN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cblxuXG5cbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpXG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCd2YWxpZGF0ZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlXG5cbiAgICAgICAgJGh0dHAuZ2V0KCdhcGkvdXNlcnMvdmFsaWRhdGUvJyArICRzdGF0ZVBhcmFtcy5pZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcbiAgICAgICAgICAgICAgICBpZihyZXMuc3RhdHVzID09IDIwMCl7XG4gICAgICAgICAgICAgICAgXHQkc2NvcGUudmVyaWZpZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgXHQkc2NvcGUubG9hZGluZyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgXHQkc2NvcGUudmVyaWZpZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgIFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSlcblxuXG5cblxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuc2VydmljZSgnYXV0aCcsIGZ1bmN0aW9uKCRodHRwLCAkd2luZG93LCAkbG9jYXRpb24sICRyb290U2NvcGUpIHtcblxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRVc2VyOiBnZXRVc2VyLFxuICAgICAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICAgICAgcmVnaXN0ZXI6IHJlZ2lzdGVyLFxuICAgICAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG4gICAgICAgICAgICBzdG9yZVRva2VuOiBzdG9yZVRva2VuLFxuICAgICAgICAgICAgaXNMb2dnZWQ6IGlzTG9nZ2VkLFxuICAgICAgICAgICAgcG9zdExvZ2luT3BzOiBwb3N0TG9naW5PcHMsXG4gICAgICAgICAgICBwb3N0TG9naW5Sb3V0ZUhhbmRsZXI6IHBvc3RMb2dpblJvdXRlSGFuZGxlclxuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3VzZXJzJylcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnYXBpL3Nlc3Npb25zJywge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZWdpc3RlcihuYW1lLCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcblxuICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdhcGkvdXNlcnMnLCB7XG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlcl90b2tlbicpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2xvZ2dlZF91c2VyJyk7XG4gICAgICAgICAgICBkZWxldGUgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmlzTG9nZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL2xvZ2luXCIpXG5cblxuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzdG9yZVRva2VuKHJlcywgY2IpIHtcbiAgICAgICAgICAgICR3aW5kb3cuc2Vzc2lvblN0b3JhZ2VbXCJ1c2VyX3Rva2VuXCJdID0gcmVzXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcl90b2tlbicsIHJlcyk7XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSAkd2luZG93LnNlc3Npb25TdG9yYWdlLnVzZXJfdG9rZW5cbiAgICAgICAgICAgIGlmIChjYiAmJiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0xvZ2dlZCgpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcG9zdExvZ2luT3BzKHJlcywgY2IpIHtcblxuICAgICAgICAgICAgXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gcmVzLm5hbWVcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2dnZWRfdXNlcicsICRyb290U2NvcGUuY3VycmVudFVzZXIpXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmlzTG9nZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChjYiAmJiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHBvc3RMb2dpblJvdXRlSGFuZGxlcigpIHtcbiAgICAgICAgICAgIGlmICgkcm9vdFNjb3BlLmludGVuZGVkUm91dGUpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgkcm9vdFNjb3BlLmludGVuZGVkUm91dGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcblxuICAgIH0pXG4iLCJcbmFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5zZXJ2aWNlKCdwcm9nbml0b3InLCBmdW5jdGlvbigkaHR0cCwgJHdpbmRvdywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcblxuXG4gICAgICAgICAgICBzZXRTZXR1cFByb2Nlc3M6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlKVxuICAgICAgICAgICAgICAgICRzY29wZS5zZXR1cCA9IGZ1bmN0aW9uKGNhbGxiYWNrRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5sb2FkaW5nKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KCRzY29wZS5hcGlVcmkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICRzY29wZS5zdGF0ZS5sYXN0UGFnZSA9IGRhdGEubGFzdF9wYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pc0xhc3RQYWdlID0gKCRzY29wZS5zdGF0ZS5wYWdlTnVtID09ICRzY29wZS5zdGF0ZS5sYXN0UGFnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTsqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja0ZuICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrRm4oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyA9PSA0MDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdyZW5kZXI0MDQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuXG5cbiAgICAgICAgICAgIHJ1bjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbiBwcm9nbml0b3Igc2VydmljZVwiKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2V0dXBQcm9jZXNzKCRzY29wZSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cblxuICAgIH0pXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
