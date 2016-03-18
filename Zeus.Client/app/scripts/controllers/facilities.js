﻿'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilitiesCtrl', function ($scope, $http, $location, baseUrl, messageService) {

        $http({
            method: 'GET',
            url: baseUrl + '/facilities'
        }).then(function successCallback(response) {
            $scope.facilities = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        $scope.toggleView = function () {
            $location.url("/facilities");
        }

        $scope.addFacility = function () {
            $location.url("/facilities/new");
        }
    });
