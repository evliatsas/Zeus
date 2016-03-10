'use strict';

angular
    .module('zeusclientApp')
    .controller('PersonCtrl', function ($scope, $http, $routeParams, $location, $uibModal, baseUrl, lookupService, messageService) {

        var isInsert = $routeParams.id == 'new';
        $scope.lookup = lookupService;

        $scope.reportcolumns = [
            { Caption: 'Όνομα', Field: 'Name' },
            { Caption: 'Εθνικότητα', Field: 'Nationality' },
            { Caption: 'Διαβατήριο', Field: 'Passport' },
            { Caption: 'Ηλικία', Field: 'Age', Type: 'Number' },
            { Caption: 'Ευπαθής', Field: 'IsSensitive', Type: 'Boolean' },
            { Caption: 'Ευπάθεια', Field: 'Sensitivity' },
            { Caption: 'Δομή', Field: 'Facility.Name' }
        ];

        $http({
            method: 'GET',
            url: baseUrl + '/common/facilities'
        }).then(function successCallback(response) {
            $scope.facilities = response.data;
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });


        if (isInsert) {
            //$scope.data = {};
        } else {
            $http({
                method: 'GET',
                url: baseUrl + '/persons/' + $routeParams.id
            }).then(function successCallback(response) {
                $scope.data = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.addRelative = function () {

            $scope.relatives = [];

            $scope.data.Relatives.forEach(function (element, index, array) {
                $scope.relatives.push({ Id: element.RelativeId });
            });

            var picker = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/templates/lookup-modal.html',
                controller: 'lookupCtrl',
                controllerAs: 'lookupCtrl',
                resolve: {
                    modaldata: function () {
                        return {
                            type: 'Person',
                            selected: $scope.relatives
                        };
                    }
                }
            });

            picker.result.then(function (data) {
                $scope.relatives = data.selected;

            }, function () {
                //modal dismissed
            });
        }

        // SAVE - DELETE
        $scope.save = function () {
            if (isInsert) {
                // Create person
                var method = 'POST';
            }
            else {
                // Update person
                var method = 'PUT';
            }

            $http({
                method: method,
                data: $scope.data,
                url: baseUrl + '/persons'
            }).then(function successCallback(response) {
                messageService.saveSuccess();
                $scope.data = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        var deleteItem = function () {
            $http({
                method: 'DELETE',
                url: baseUrl + '/persons/' + $scope.data.Id
            }).then(function successCallback(response) {
                messageService.deleteSuccess();
                $location.url('/persons');
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteItem);
        }
    });
