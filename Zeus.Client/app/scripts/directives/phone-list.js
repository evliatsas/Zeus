'use strict';

angular
    .module('zeusclientApp')
    .directive('phoneList', function () {
        return {
            scope: {
                phones: '='
            },
            templateUrl: '/templates/phone-list.html',
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