'use strict';

angular
    .module('zeusclientApp')
    .controller('PersonCtrl', function ($scope, $http, $routeParams, $location, $uibModal, baseUrl, lookupService, messageService) {

        var isInsert = $routeParams.id == 'new';
        $scope.lookup = lookupService;

        $scope.reportcolumns = [
            { Caption: 'GRID.NAME', Field: 'Name' },
            { Caption: 'GRID.NATIONALITY', Field: 'Nationality' },
            { Caption: 'PERSON.PASSPORT', Field: 'Passport' },
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
            $scope.data = {};
            $scope.data.Relatives = [];
        } else {
            $http({
                method: 'GET',
                url: baseUrl + '/persons/' + $routeParams.id
            }).then(function successCallback(response) {
                $scope.data = response.data;
            }, function errorCallback(response) {
                messageService.showError(response.data);
            });
        }

        $scope.addRelative = function () {

            $scope.relatives = [];

            $scope.data.Relatives.forEach(function (element, index) {
                $scope.relatives.push({ Id: element.RelativeId, Relationship: element.Relationship });
            });

            var picker = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: 'views/templates/lookup-modal.html',
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
                var updated = [];
                data.selected.forEach(function (element, index) {
                    var relation = {
                        Relative: element,
                        RelativeId: element.Id
                    };
                    for (var r in $scope.relatives) {
                        if ($scope.relatives[r].Id == relation.Relative.Id) {
                            relation.Relationship = $scope.relatives[r].Relationship;
                        }
                    }
                    updated.push(relation);
                });

                $scope.data.Relatives = updated;

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
                messageService.showError(response.data);
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
                messageService.showError(response.data);
            });
        }

        $scope.delete = function () {
            messageService.askDeleteConfirmation(deleteItem);
        }
    });
