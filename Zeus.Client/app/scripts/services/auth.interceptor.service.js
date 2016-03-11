(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('authInterceptorService', authInterceptorService);

    authInterceptorService.$inject = ['$rootScope', '$q', '$location','localStorageService'];

    function authInterceptorService($rootScope, $q, $location, localStorageService) {
        var service = {};

        var _request = function (config) {
            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData && authData.access_token) {
                config.headers.Authorization = 'Bearer ' + authData.access_token;
            }

            return config;
        }

        var _responseError = function (rejection) {
            if (rejection.status == 401) {
                localStorageService.remove('authorizationData');
                $rootScope.redirectLocation = $location.path() == '/login' ? '/' : $location.path();
                $location.path('/login');                
            }

            return $q.reject(rejection);
        }

        service.request = _request;
        service.responseError = _responseError;

        return service;
    }
})();