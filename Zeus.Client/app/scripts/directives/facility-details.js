﻿'use strict';

angular
    .module('zeusclientApp')
    .directive('facilityDetails', function (lookupService) {
        return {
            scope: {
                facility: '='
            },
            templateUrl: 'views/templates/facility-details.html',
            link: function postLink(scope, element, attrs) {
                scope.lookup = lookupService;
            }
        };
});