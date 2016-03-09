'use strict';

angular
    .module('zeusclientApp')
    .controller('HousingCtrl', function ($scope, $window, $timeout, $http, $routeParams, $location, $uibModal, lookupService, messageService, baseUrl) {

        var isInsert = $routeParams.pid == 'new';

        $scope.housingcolumns = [
          { Caption: 'Κατηγορία', Field: 'Type', Values: lookupService.housingCategories, Tooltip: 'Κατηγορία Εγκατάστασης' },
          { Caption: 'Χωρητικότητα', Field: 'Capacity', Type: 'LookupHtml', Tooltip: 'Χωρητικότητα' },
          { Caption: 'Φιλοξενούμενοι', Field: 'Attendance', Tooltip: 'Φιλοξενούμενοι' },
          { Caption: 'Πλήθος', Field: 'Count', Tooltip: 'Πλήθος' },
          { Caption: 'Κατάσταση', Field: 'Status', Values: lookupService.statuses, Tooltip: 'Κατάσταση' }
        ];

        $scope.lookupColumns = [
                    { Caption: 'Τύπος', Field: 'Tag' },
                    { Caption: 'Όνομα', Field: 'Description' }
        ];

    });
