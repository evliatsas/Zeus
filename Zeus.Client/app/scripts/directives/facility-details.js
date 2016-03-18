'use strict';

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

                scope.beforeRenderStartDate = function ($view, $dates, $leftDate, $upDate, $rightDate) {
                    if (scope.facility && scope.facility.StatusDateTime) {
                        var activeDate = moment(scope.facility.StatusDateTime);
                        for (var i = 0; i < $dates.length; i++) {
                            if ($dates[i].localDateValue() >= activeDate.valueOf()) $dates[i].selectable = false;
                        }
                    }
                }

                scope.beforeRenderEndDate = function ($view, $dates, $leftDate, $upDate, $rightDate) {
                    if (scope.facility && scope.facility.StatusECT) {
                        var activeDate = moment(scope.facility.StatusECT).subtract(1, $view).add(1, 'minute');
                        for (var i = 0; i < $dates.length; i++) {
                            if ($dates[i].localDateValue() <= activeDate.valueOf()) {
                                $dates[i].selectable = false;
                            }
                        }
                    }
                }
            }
        };
});