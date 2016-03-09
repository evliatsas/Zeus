'use strict';

angular
    .module('zeusclientApp')
    .directive('addGridButton', function ($uibModal) {
        return {
            transclude: true,
            templateUrl: '/templates/add-grid-button.html',
            link: function postLink(scope, element, attrs) {

                if (scope.lookupType == 'Contact') {
                    scope.title = 'Προσθήκη Επαφής';
                }
                else if (scope.lookupType == 'Facility') {
                    scope.title = 'Προσθήκη Δομής Φιλοξενίας';
                }
                else if (scope.lookupType == 'Provider') {
                    scope.title = 'Προσθήκη Προμηθευτή';
                }
                
                scope.openPicker = function () {
                    var picker = $uibModal.open({
                        animation: true,
                        size: 'md',
                        templateUrl: '/templates/lookup-modal.html',
                        controller: 'lookupCtrl',
                        controllerAs: 'lookupCtrl',
                        resolve: {
                            modaldata: function () {
                                return {
                                    type: scope.lookupType,
                                    selected: scope.gridItems
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
        };
    });