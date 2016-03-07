'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilitiesCtrl', function ($scope, $http, baseUrl) {

        $scope.addFacility = function () {
            alert('add facility');
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
