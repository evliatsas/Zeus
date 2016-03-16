'use strict';

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
        else {
            $scope.operation.Type = 0;
            $scope.operation.Preparations = [];
            $scope.operation.Transports = [];
            $scope.operation.Providers = [];
        }

        // Get Lookup Values

        $http({
            method: 'GET',
            url: baseUrl + '/common/facilities' //lookup facilities
        }).then(function successCallback(response) {
            for (var i in response.data)
                $scope.facilities.push(response.data[i].Description);
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

        $scope.addPreparation = function () {
            var newPrep = {
                Completion: 0
            };
            $scope.operation.Preparations.push(newPrep);
        }

        $scope.addProvider = function () {
            var newProv = {
            };
            $scope.operation.Providers.push(newProv);
        }

        $scope.openProvider = function (id) {
            if (id)
                $location.url("/providers/" + id);
        }

        $scope.openContact = function () {
            if ($scope.operation.DestinationContactId)
                $location.url("/contacts/" + $scope.operation.DestinationContactId);
        }

        $scope.cancel = function () {
            $scope.operation.IsCancelled = true;
            $scope.save();
        }

        $scope.activate = function () {
            $scope.operation.IsCancelled = false;
            $scope.save();
        }

        $scope.beforeRenderStartDate = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            if ($scope.operation.ETA) {
                var activeDate = moment($scope.operation.ETA);
                for (var i = 0; i < $dates.length; i++) {
                    if ($dates[i].localDateValue() >= activeDate.valueOf()) $dates[i].selectable = false;
                }
            }
        }

        $scope.beforeRenderEctDate = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            if ($scope.operation.Start) {
                var activeDate = moment($scope.operation.Start).subtract(1, $view).add(1, 'minute');
                for (var i = 0; i < $dates.length; i++) {
                    if ($dates[i].localDateValue() <= activeDate.valueOf()) {
                        $dates[i].selectable = false;
                    }
                }
            }
        }

        $scope.beforeRenderEndDate = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            if ($scope.operation.Start) {
                var activeDate = moment($scope.operation.Start).subtract(1, $view).add(1, 'minute');
                for (var i = 0; i < $dates.length; i++) {
                    if ($dates[i].localDateValue() <= activeDate.valueOf()) {
                        $dates[i].selectable = false;
                    }
                }
            }
        }
    });
