'use strict';

angular
    .module('zeusclientApp')
    .directive('lookupPicker', function ($modalInstance, modaldata) {
        return {
            templateUrl: '/templates/lookup-picker.html',
            link: function postLink(scope, element, attrs) {
                scope.lookupColumns = [
                    { Caption: 'Τύπος', Field: 'Tag' },
                    { Caption: 'Όνομα', Field: 'Description' }
                ];

                scope.title = modaldata.title;
                scope.list = modaldata.list;
                scope.selectedItems = modaldata.selected;

                scope.selectItem = function (item) {
                    var index = vm.selectedItems.indexOf(item);
                    if ( index > -1) {
                        vm.selectedItems.splice(index, 1);
                    }
                    else {
                        vm.selectedItems.push(item);
                    }
                }

                scope.ok = function () {
                    var result = {
                        selected: scope.selectedItems
                    };
                    $modalInstance.close(result);
                };

                scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                }
            }
        };
    });