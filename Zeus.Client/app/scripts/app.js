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
    'angular-loading-bar',
    'ui.bootstrap.datetimepicker',
    'ui.dateTimeInput',
    'LocalStorageModule',
    'pascalprecht.translate',
    'chart.js'
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
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'loginCtrl'
        })
        .when('/persons/:id', {
            templateUrl: 'views/person.html',
            controller: 'PersonCtrl',
            controllerAs: 'person'
        })
        .when('/reports/:type/:fid/:id', {
            templateUrl: function (params) {
                var type = params.type;
                var tempUrl = 'views/reports/';
                if (type == 0)
                    tempUrl += 'feeding-report.html';
                else if (type == 1)
                    tempUrl += 'housing-report.html';
                else if (type == 2)
                    tempUrl += 'transport-report.html';
                else if (type == 5)
                    tempUrl += 'situation-report.html';
                else
                    tempUrl += 'report.html';

                return tempUrl;
            },
            controller: 'ReportCtrl',
            controllerAs: 'reportCtrl'
        })
        .when('/reports/archive', {
            templateUrl: 'views/archive.html',
            controller: 'ArchiveCtrl',
            controllerAs: 'archiveCtrl'
        })
        .when('/log', {
            templateUrl: 'views/log.html',
            controller: 'LogCtrl',
            controllerAs: 'logCtrl'
        })
        .when('/reports/messages', {
            templateUrl: 'views/messages.html',
            controller: 'MessagesCtrl',
            controllerAs: 'messagesCtrl'
        })
        .when('/providers/:id', {
            templateUrl: 'views/provider.html',
            controller: 'ProviderCtrl',
            controllerAs: 'providerCtrl'
        })
        .when('/providers', {
            templateUrl: 'views/providers.html',
            controller: 'ProvidersCtrl',
            controllerAs: 'providersCtrl'
        })
        .when('/operations/:id', {
              templateUrl: 'views/operation.html',
              controller: 'OperationCtrl',
              controllerAs: 'operationCtrl'
          })
        .when('/operations', {
            templateUrl: 'views/operations.html',
            controller: 'OperationsCtrl',
            controllerAs: 'operationsCtrl'
        })
        .when('/contacts/:id', {
            templateUrl: 'views/contact.html',
            controller: 'ContactCtrl',
            controllerAs: 'contactCtrl'
        })
        .when('/contacts', {
            templateUrl: 'views/contacts.html',
            controller: 'ContactsCtrl',
            controllerAs: 'contactsCtrl'
        })
        .when('/charts', {
            templateUrl: 'views/charts.html',
            controller: 'ChartsCtrl',
            controllerAs: 'chartsCtrl'
        })
        .when('/users', {
            templateUrl: 'views/users.html',
            controller: 'UsersCtrl',
            controllerAs: 'usersCtrl'
        })
        .when('/users/:id', {
            templateUrl: 'views/user.html',
            controller: 'UserCtrl',
            controllerAs: 'userCtrl'
        })
        .when('/dailyreport', {
            templateUrl: 'views/dailyreport.html',
            controller: 'DailyReportCtrl',
            controllerAs: 'dailyReportCtrl'
        })
        .when('/dailyreport/stats', {
            templateUrl: 'views/dailyreport_charts.html',
            controller: 'DailyReportChartsCtrl',
            controllerAs: 'dailyReportChartsCtrl'
        })
        .when('/calendar/:id', {
            templateUrl: 'views/calendarEntry.html',
            controller: 'CalendarEntryCtrl',
            controllerAs: 'calendarEntryCtrl'
        })
        .when('/calendar', {
            templateUrl: 'views/calendar.html',
            controller: 'CalendarCtrl',
            controllerAs: 'calendarCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
  })
  .config(function ($httpProvider, localStorageServiceProvider) {
      localStorageServiceProvider
          .setPrefix('ZeusApp')
          .setStorageType('sessionStorage')
          .setNotify(true, true)

      $httpProvider.interceptors.push('authInterceptorService');
  })
  .constant("baseUrl", "http://localhost:8080")
  .constant("authUrl", "http://localhost:8080/oauth2/token")
  .constant("moment", moment)
  .constant('toastr', toastr)
  .directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
})
.run(['$rootScope', '$location', 'authService', function ($rootScope, $location, authService) {
    $rootScope.$on('$routeChangeStart', function (event) {
        if (!authService.isAuth() && $location.path() != "/login") {
            event.preventDefault();
            $location.path('/login');
        }
    });

    // define default chart colours
    Chart.defaults.global.colours = [
            '#97BBCD', // blue
            '#949FB1', // grey
            '#F7464A', // red
            '#46BFBD', // green
            '#FDB45C', // yellow
            '#DCDCDC', // light grey
            '#4D5360'  // dark grey
        ];
}]);