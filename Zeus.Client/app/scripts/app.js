'use strict';

/**
 * @ngdoc overview
 * @name zeusclientApp
 * @description
 * # zeusclientApp
 *
 * Main module of the application.
 */
angular
  .module('zeusclientApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'angular-loading-bar'
  ])
  .config(function ($routeProvider) {
      $.material.init();
      $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        })
        .when('/facilities', {
            templateUrl: 'views/facilities.html',
            controller: 'FacilitiesCtrl',
            controllerAs: 'facilities'
        })
        .when('/facilities/:id', {
            templateUrl: 'views/facility.html',
            controller: 'FacilityCtrl',
            controllerAs: 'facility'
        })
        .when('/map', {
            templateUrl: 'views/map.html',
            controller: 'MapCtrl',
            controllerAs: 'map'
        })
        .when('/persons', {
            templateUrl: 'views/persons.html',
            controller: 'PersonsCtrl',
            controllerAs: 'persons'
        })
        .when('/persons/:id', {
            templateUrl: 'views/person.html',
            controller: 'PersonCtrl',
            controllerAs: 'person'
        })
        .when('/reports/:type/:fid/:rid', {
            templateUrl: 'views/report.html',
            controller: 'ReportCtrl',
            controllerAs: 'reportCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
  })
  .constant("moment", moment)
  .constant("baseUrl", "http://localhost:8080/api")
  .constant('toastr', toastr);
