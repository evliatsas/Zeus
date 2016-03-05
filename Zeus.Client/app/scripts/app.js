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
    'ui.bootstrap'
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
      .otherwise({
        redirectTo: '/'
      });
  });
