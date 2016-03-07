'use strict';

angular
    .module('zeusclientApp')
    .controller('FacilityCtrl', function ($scope, $window, $timeout, $http, $routeParams, lookupService, messageService, baseUrl) {

        $scope.reportcolumns = [
            { Caption: 'Τ', Field: 'Type', Type: 'LookupHtml', Values: lookupService.reportTypesHtml, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'Π', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'Θέμα', Field: 'Subject' },
            { Caption: 'Συντάκτης', Field: 'User.Title' },
            { Caption: 'Ημερομηνία', Field: 'DateTime', Type: 'DateTime' }
        ];

        var testFunc = function () {
            var q = 5;
        }

        $scope.saveFacility = function () {
            alert('facility saved');
            return true;
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

        $scope.addReport = function () {
            // gamise mas edw den lynetai me aplo push sto array
            alert('add report');
        }

        $http({
            method: 'GET',
            url: baseUrl + '/facilities/' + $routeParams.id
        }).then(function successCallback(response) {
            $scope.data = response.data;
        }, function errorCallback(response) {
            messageService.showError();
        });
    });
