﻿'use strict';

angular
    .module('zeusclientApp')
    .controller('OperationCtrl', function ($scope, $http, $routeParams, $location, lookupService, messageService, baseUrl) {

        $scope.lookup = lookupService;
        $scope.facilities = [];
        $scope.providers = [];
        $scope.contacts = [];
        $scope.operation = {};

        var isInsert = $routeParams.id == 'new';

        if (!isInsert) {
            $http({
                method: 'GET',
                url: baseUrl + '/operations/' + $routeParams.id //the unique id of the operation
            }).then(function successCallback(response) {
                $scope.operation = response.data;
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }

        // Get Lookup Values

        $http({
            method: 'GET',
            url: baseUrl + '/common/facilities' //lookup facilities
        }).then(function successCallback(response) {
            $scope.facilities = response.data;
        }, function errorCallback(response) {
            $scope.facilities = [];
            messageService.getFailed(response.error);
        });

        $http({
            method: 'GET',
            url: baseUrl + '/common/providers' //lookup providers
        }).then(function successCallback(response) {
            $scope.providers = response.data;
        }, function errorCallback(response) {
            $scope.providers = [];
            messageService.getFailed(response.error);
        });

        $http({
            method: 'GET',
            url: baseUrl + '/common/contacts' //lookup contacts
        }).then(function successCallback(response) {
            $scope.contacts = response.data;
        }, function errorCallback(response) {
            $scope.contacts = [];
            messageService.getFailed(response.error);
        });

        //************

        $scope.save = function () {            
            if (isInsert) {
                // Create operation
                var method = 'POST';
            }
            else {
                // Update operation
                var method = 'PUT';
            }
                        
            $http({
                method: method,
                data: $scope.operation,
                url: baseUrl + '/operations'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
                if (isInsert)
                    $location.url('/operations/' + response.data.Id);
                else
                    $scope.operation = response.data;
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }

        var deleteOperation = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/operations/' + $scope.operation.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                $location.url('/operations');
            }, function errorCallback(response) {
                messageService.getFailed(response.error);
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteOperation);
        }
    });