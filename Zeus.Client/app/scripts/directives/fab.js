'use strict';

angular
    .module('zeusclientApp')
    .directive('fab', function () {
        return {
            scope: {
                icon: '@',
                title: '@?',
                click: '&onClick'
            },
            transclude: true,
            templateUrl: '/templates/fab.html',
            link: function postLink(scope, element, attrs) {
                scope.title = scope.title || 'Προσθήκη νέου';
            }
        };
});