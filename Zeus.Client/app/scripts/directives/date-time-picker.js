angular
    .module('zeusclientApp')
    .directive('dateTimePicker', function ($window) {
        var uniqueId = 1;
        return {
            scope: {
                label: '@',
                date: '='
            },
            templateUrl: '/templates/date-time-picker.html',
            link: function postLink(scope, element, attrs) {
                var dt = 'dt' + uniqueId++;
                element.find('input').parent().attr('id', dt);
                $('#' + dt).datetimepicker({
                    format:'dd DD/MM/YYYY HH:mm'
                });
            }
        };
    });