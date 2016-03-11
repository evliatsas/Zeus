'use strict';

angular
    .module('zeusclientApp')
    .controller('MessageCtrl', function ($scope, $http, $routeParams, $uibModal, $location, baseUrl, lookupService, messageService) {

        $scope.lookup = lookupService;
        $scope.reports = [];
        $scope.from = new Date();
        $scope.to = new Date();

        $scope.reportcolumns = [
            { Caption: 'Π', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'Δομή Φιλοξενίας', Field: 'Facility.Name' },
            { Caption: 'Θέμα', Field: 'Subject' },
            { Caption: 'Συντάκτης', Field: 'User.Title' },
            { Caption: 'Ημερομηνία', Field: 'DateTime', Type: 'DateTime' }
        ];

        $scope.getMessage = function () {
            $http({
                method: 'POST',
                data: dates,
                url: baseUrl + '/reports/message'
            }).then(function successCallback(response) {
                $scope.reports = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }
    });