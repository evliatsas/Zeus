'use strict';

angular
    .module('zeusclientApp')
    .directive('saveAlert', function () {
        return {
            scope: {
                entity: '=',
                noAnimation: '=',
                onSave: '&'
            },
            transclude: true,
            templateUrl: '/templates/save-alert.html',
            link: function postLink(scope, element, attrs) {
                scope.hasChanges = false;
                scope.closed = false;

                scope.save = function () {
                    var saved = scope.onSave();
                    if (saved) {
                        scope.hasChanges = false;
                    }
                };

                scope.cancel = function () {
                    scope.closed = true;
                };

                scope.$watch('entity', function (newValue, oldValue) {
                    if (newValue && !angular.equals(newValue, oldValue))
                        scope.hasChanges = true;
                }, true);
            }
        };
    });