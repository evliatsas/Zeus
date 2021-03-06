﻿'use strict';

angular
    .module('zeusclientApp')
    .controller('UserCtrl', function ($scope, $http, $routeParams, $location, baseUrl, messageService, authService, lookupService) {

        $scope.isInsert = $routeParams.id == 'new';
        $scope.lookup = lookupService;

        $http({
            method: 'GET',
            url: baseUrl + '/common/facilities'
        }).then(function successCallback(response) {
            $scope.facilities = response.data;
        }, function errorCallback(response) {
            $scope.facilities = [];
        });

        $http({
            method: 'GET',
            url: baseUrl + '/common/providers'
        }).then(function successCallback(response) {
            $scope.providers = response.data;
        }, function errorCallback(response) {
            $scope.providers = [];
        });

        if ($scope.isInsert) {
            $scope.user = { Roles: ['Viewer'], Claims: [] };
        } else {
            $http({
                method: 'GET',
                url: baseUrl + '/users/' + $routeParams.id
            }).then(function successCallback(response) {
                $scope.user = response.data;
            }, function errorCallback(response) {
                messageService.showError(response.data);
            });
        }

        // SAVE - DELETE
        $scope.save = function () {
            if ($scope.isInsert) {
                // Create user
                var method = 'POST';
            }
            else {
                // Update user
                var method = 'PUT';
            }

            $http({
                method: method,
                data: $scope.user,
                url: baseUrl + '/users'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
                $scope.user = response.data;
                $location.url('/users/' + response.data.UserName);
            }, function errorCallback(response) {
                messageService.showError(response.data.Message);
            });
        }

        var deleteItem = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/users/' + $scope.user.UserName
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                $location.url('/users');
            }, function errorCallback(response) {
                messageService.showError(response.data);
            });
        }

        $scope.changePassword = function () {
            authService.changePassword($scope.user,"reset");
        }

        $scope.addRole = function(role) {
            $scope.user.Roles.push(role);
        }

        $scope.addClaim = function () {
            var claim = {
                Type: 'Facility',
                Value: ''
            };
            $scope.user.Claims.push(claim);
        }
    });
