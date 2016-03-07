﻿'use strict';

angular
    .module('zeusclientApp')
    .directive('fab', function () {
        return {
            scope: {
                icon: '@',
                click: '&onClick'
            },
            transclude: true,
            templateUrl: '/templates/fab.html',
            link: function postLink(scope, element, attrs) {

            }
        };
});