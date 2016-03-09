'use strict';

angular
    .module('zeusclientApp')
    .directive('contactPicker', function () {
        return {
            scope: {
                phones: '='
            },
            templateUrl: '/templates/contact-picker.html',
            link: function postLink(scope, element, attrs) {
                scope.phoneTypes = [
                    'Κινητό',
                    'Σταθερό',
                    'Fax',
                    'Crypto'
                ];

                scope.addPhone = function () {
                    scope.phones.push({
                        "Type": "Κινητό",
                        "Number": ""
                    });
                }
            }
        };
    });