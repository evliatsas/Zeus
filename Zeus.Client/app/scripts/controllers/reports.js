'use strict';

angular
    .module('zeusclientApp')
    .controller('ReportsCtrl', function($scope, $http, $routeParams, $location, lookupService, utilitiesService, messageService, baseUrl) {

        $scope.util = utilitiesService;
        $scope.reports = [];
        $scope.reportType = $routeParams.type;

        var customReportGrid = function() {
            switch ($scope.reportType) {
                case "0":
                    $scope.title = "Σίτισης";
                    var col1 = { Caption: 'FEEDING_REPORT.PROVIDER', Field: 'FeedingProvider.Name' };
                    var col2 = { Caption: 'FEEDING_REPORT.RATIONS', Field: 'Rations' };
                    var col3 = { Caption: 'FEEDING_REPORT.MEAL', Field: 'Meal' };
                    $scope.reportcolumns.push(col1);
                    $scope.reportcolumns.push(col2);
                    $scope.reportcolumns.push(col3);
                    break;
                case "1":
                    $scope.title = "Στέγασης";
                    var col1 = { Caption: 'HOUSING_REPORT.TYPE', Field: 'Housing.Type' };
                    var col2 = { Caption: 'HOUSING_REPORT.HOUSE_COUNT', Field: 'HousedCount' };
                    $scope.reportcolumns.push(col1);
                    $scope.reportcolumns.push(col2);
                    break;
                case "2":
                    $scope.title = "Μετακίνησης";
                    var col1 = { Caption: 'TRANSPORT_REPORT.STARTING_POINT', Field: 'StartingPoint' };
                    var col2 = { Caption: 'TRANSPORT_REPORT.DESTINATION', Field: 'Destination' };
                    var col3 = { Caption: 'TRANSPORT_REPORT.MOVEMENT_TYPE', Field: 'MovementType' };
                    var col4 = { Caption: 'TRANSPORT_REPORT.PERSON_COUNT', Field: 'PersonCount' };
                    var col5 = { Caption: 'TRANSPORT_REPORT.DEPARTURE', Field: 'Departure', Type: 'DateTime' };
                    var col6 = { Caption: 'TRANSPORT_REPORT.ETA', Field: 'ETA', Type: 'DateTime' };
                    $scope.reportcolumns.push(col1);
                    $scope.reportcolumns.push(col2);
                    $scope.reportcolumns.push(col3);
                    $scope.reportcolumns.push(col4);
                    $scope.reportcolumns.push(col5);
                    $scope.reportcolumns.push(col6);
                    break;
                case "3":
                    $scope.title = "Προβλημάτων";                    
                    var col1 = { Caption: 'FACILITY_DETAILS.CATEGORY', Field: 'Category', Type: 'Lookup', Values: lookupService.reportCategories, Tooltip: 'Κατηγορία Προβλήματος' };
                    $scope.reportcolumns.push(col1);
                    break;
                case "4":
                    $scope.title = "Αίτησης-Ελλείψεων";
                    var col1 = { Caption: 'FACILITY_DETAILS.CATEGORY', Field: 'Category', Type: 'Lookup', Values: lookupService.reportCategories, Tooltip: 'Κατηγορία Αίτησης' };
                    $scope.reportcolumns.push(col1);
                    break;
                case "5":
                    $scope.title = "Τρέχουσας Κατάστασης";
                    var col1 = { Caption: 'FACILITY_CARD.GUESTS', Field: 'PersonCount' };
                    var col2 = { Caption: 'PERSON.SENSITIVITY', Field: 'SensitiveCount' };
                    $scope.reportcolumns.push(col1);
                    $scope.reportcolumns.push(col2);
                    break;
                case "6":
                    $scope.title = "Οδηγίες-Μηνύματα";
                    var col1 = { Caption: 'CHARTS.FROM', Field: 'Sender' };
                    var col2 = { Caption: 'CHARTS.TO', Field: 'Recipient' };
                    var col3 = { Caption: 'REPORT.TYPE', Field: 'RecipientType' };
                    $scope.reportcolumns.push(col1);
                    $scope.reportcolumns.push(col2);
                    $scope.reportcolumns.push(col3);
                    break;
            }
        }

        $scope.reportcolumns = [
            { Caption: 'GRID.TYPE', Field: 'Type', Type: 'LookupHtml', Values: lookupService.reportTypesHtml, Tooltip: 'Τύπος Αναφοράς' },
            { Caption: 'GRID.PRIORITY', Field: 'Priority', Type: 'LookupHtml', Values: lookupService.priorities, Tooltip: 'Προτεραιότητα Αναφοράς' },
            { Caption: 'GRID.FACILITY', Field: 'Facility.Name' },
            { Caption: 'GRID.SUBJECT', Field: 'Subject' },
            { Caption: 'GRID.AUTHOR', Field: 'User.Title' },
            { Caption: 'GRID.DATETIME', Field: 'DateTime', Type: 'DateTime' }
        ];

        $http({
            method: 'GET',
            url: baseUrl + '/reports/type/' + $routeParams.type //the unique id of the report
        }).then(function successCallback(response) {
            $scope.reports = response.data;
            customReportGrid();
        }, function errorCallback(response) {
            messageService.getFailed(response.error);
        });

        $scope.showReport = function (report) {
            var location = '/reports/' + report.Type + '/' + report.FacilityId + '/' + report.Id;
            $location.url(location);
        }

    });
