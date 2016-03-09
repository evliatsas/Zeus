'use strict';

angular
    .module('zeusclientApp')
    .directive('addGridButton', function ($uibModal) {
        return {
            scope: {
                list: '=',
                type: '=',
                custom: '&'
            },
            templateUrl: '/templates/add-grid-button.html',
            link: function postLink(scope, element, attrs) {

                if (scope.type == 'Contact') {
                    scope.title = 'Προσθήκη Επαφής';
                }
                else if (scope.type == 'Facility') {
                    scope.title = 'Προσθήκη Δομής Φιλοξενίας';
                }
                else if (scope.type == 'Provider') {
                    scope.title = 'Προσθήκη Προμηθευτή';
                }
                
                scope.openPicker = function () {

                    if (false) {
                        scope.custom();
                    }
                    else {
                        var picker = $uibModal.open({
                            animation: true,
                            size: 'md',
                            templateUrl: '/templates/lookup-modal.html',
                            controller: 'lookupCtrl',
                            controllerAs: 'lookupCtrl',
                            resolve: {
                                modaldata: function () {
                                    return {
                                        type: scope.type,
                                        selected: scope.list
                                    };
                                }
                            }
                        });

                        picker.result.then(function (data) {
                            scope.list = data.selected;
                        }, function () {
                            //modal dismissed
                        });
                    }
                }
            }
        };
    });