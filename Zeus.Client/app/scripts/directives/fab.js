'use strict';

angular.module('zeusclientApp')
.directive('fab', function () {
    return {
        scope: {
            fabIcon: '@',
            fabClick: '&fabOnClick',
            fabSmall: '='
        },
        transclude: true,
        templateUrl: '/templates/fab.html',
        link: function postLink(scope, element, attrs) {

        }
    };
});