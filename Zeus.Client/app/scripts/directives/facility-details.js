'use strict';

angular
    .module('zeusclientApp')
    .directive('facilityDetails', function () {
        return {
            scope: {
                facility: '='
            },
            templateUrl: '/templates/facility-details.html',
            link: function postLink(scope, element, attrs) {
            }
        };
});