'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilitiesCtrl', function ($scope, $http, $location, baseUrl) {

        $scope.addFacility = function () {
            $location.url("/facilities/new");
        }
        
        $http({
            method: 'GET',
            url: baseUrl + '/facilities'
        }).then(function successCallback(response) {
            $scope.facilities = response.data;
        }, function errorCallback(response) {
            messageService.showError();
        });
    });
