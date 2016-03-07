angular
    .module('zeusclientApp')
    .directive('dateTimePicker', function ($window) {
        return {
            scope: {
                label: '@',
                placeholder: '@',
                format: '@',
                date: '='
            },
            templateUrl: '/templates/date-time-picker.html',
            link: function postLink(scope, element, attrs) {
                scope.opened = false;
                scope.width = function () {
                    return $window.innerWidth;
                }
            }
        };
});