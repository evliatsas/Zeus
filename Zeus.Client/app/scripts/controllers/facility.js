'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilityCtrl', function ($scope, $window, $timeout, $http, $routeParams, $location, lookupService, messageService, baseUrl) {

        $scope.reportcolumns = [
            { Caption: 'Τ', Field: 'Type', Type: 'LookupHtml', Values: lookupService.reportTypesHtml, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'Π', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'Θέμα', Field: 'Subject' },
            { Caption: 'Συντάκτης', Field: 'User.Title' },
            { Caption: 'Ημερομηνία', Field: 'DateTime', Type: 'DateTime' }
        ];
               
        $scope.saveFacility = function () {
            $http({
                method: $routeParams.id == "new" ? 'POST' : 'PUT',
                data: $scope.data,
                url: baseUrl + '/facilities'
            }).then(function successCallback(response) {
                $scope.data = response.data;
                return true;
            }, function errorCallback(response) {
                messageService.showError();
                return false;
            });
        }

        var scrollToEnd = function () {
            $timeout(
                function () {
                    $window.scrollTo(0, document.body.scrollHeight);
                }, 0);
        }

        $scope.addHousing = function () {
            $scope.data.Housings.push({});
            scrollToEnd();
        }

        $scope.addContact = function () {
            $scope.data.Contacts.push({});
            scrollToEnd();
        }

        $scope.addProvider = function () {
            $scope.data.Providers.push({});
            scrollToEnd();
        }

        if ($routeParams.id == "new") {

            $scope.data = {};

        } else {

            $http({
                method: 'GET',
                url: baseUrl + '/facilities/' + $routeParams.id
            }).then(function successCallback(response) {
                $scope.data = response.data;
            }, function errorCallback(response) {
                messageService.showError();
            });
        }

        // REPORTS

        // issue a message to a contact
        $scope.sendMessage = function (fid, rid) {
            $location.url('/reports/6/' + fid + '/new');
        }
    });
