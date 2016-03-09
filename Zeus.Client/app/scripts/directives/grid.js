'use strict';

angular.module('zeusclientApp')
       .directive('cinnamonGrid', grid);

function grid($http, $filter, moment, commonUtilities) {
    return {
        scope: {
            gridColumns: '=',
            gridItems: '=',
            selectedItems: '=?',
            showGridButtons: '=',
            showCheckBoxes: '=',
            hidePagingDropdown: '=',
            hideItemButtons: '=',
            striped: '=',
            highlight: '@',
            labels: '@',
            sortAscIcon: '@',
            sortDescIcon: '@',
            groupBy: '@',
            groupClass: '@',
            groupIcon: '@',
            groupRowClick: '&groupClickFn',
            rowClick: '&rowClickFn',
            createItem: '&gridCreateFn',
            editItem: '&gridEditFn',
            viewItemDetails: '&gridDetailsFn',
            viewItemDetailsInTab: '&gridDetailsInTabFn',
            deleteItem: '&gridDeleteFn',
            actions: '&actionsFn',
            toolbar: '@',
            toolbarFn: '&toolbarFn',
            overrideEqualFn: '&overrideEqualFn',
            customActionFn: '&customActionFn',
            pageSize: '=?'
        },
        templateUrl: '/templates/grid.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {

            scope.allowRowClick = attrs['rowClickFn'] != undefined;
            scope.allowGroupRowClick = attrs['groupClickFn'] != undefined;
            scope.hasEqualOverride = attrs['overrideEqualFn'] != undefined;

            scope.gridFilter = '';
            scope.items = [];
            scope.pageSize = scope.pageSize == null ? 15 : scope.pageSize;
            scope.page = 0;
            scope.pages = [];

            if (scope.selectedItems == null)
                scope.selectedItems = [];

            scope.formatDateTime = function (dt, format) {
                if (format == undefined || format == '') {
                    format = "DD-MM-YYYY";
                }

                return moment(dt).isValid() ? moment(dt).format(format, 'el') : "";
            }

            scope.getValue = function (item, field) {
                if (field === undefined) { field = ''; }
                var result = item;
                var dots = field.split(".");
                for (var i in dots) {
                    var prop = dots[i];
                    result = result[prop];
                    if (result === null) {
                        return undefined;
                    }
                }
                return result;
            }

            scope.rowCursor = function () {
                return scope.allowRowClick ? { cursor: 'pointer' } : { cursor: 'inherit' };
            }

            scope.groupRowCursor = function () {
                return scope.allowGroupRowClick ? { cursor: 'pointer' } : { cursor: 'inherit' };
            }

            scope.gridRowClick = function (_item) {
                if (scope.allowRowClick) {
                    scope.rowClick({ item: _item });
                }
            }

            scope.gridGroupRowClick = function (_group) {
                if (scope.allowGroupRowClick) {
                    scope.groupRowClick({ group: _group });
                }
            }

            scope.reverse = false;
            scope.sortingOrder = '';

            scope.sortBy = function (sortingOrder) {
                if (scope.sortingOrder == sortingOrder) {
                    scope.reverse = !scope.reverse;
                }

                scope.gridItems.sort(dynamicSort(sortingOrder));

                scope.sortingOrder = sortingOrder;
            }

            function dynamicSort(property) {
                var sortOrder = scope.reverse ? -1 : 1;
                return function (a, b) {
                    var result = commonUtilities.naturalSort(scope.getValue(a, property), scope.getValue(b, property));
                    return result * sortOrder;
                }
            }

            function pageOf(item) {
                if (item == undefined || item == null) { return 0; }
                for (var page in scope.pages) {
                    var index = scope.pages[page].indexOf(item);
                    if (index > -1) { return page; }
                }
                return 0;
            }

            scope.toggleSelectAll = function () {
                scope.selectedItems = scope.selectedItems.length != scope.items.length ? scope.items.slice() : [];
            }

            scope.allSelected = function () {
                return scope.selectedItems.length == scope.items.length ? true : false;
            }

            scope.isSelected = function (_item) {
                if (!scope.selectedItems) {
                    return false;
                }
                else if (scope.hasEqualOverride) {
                    var index = scope.overrideEqualFn({ item: _item });
                    return index == -1 ? false : true;
                }
                else {
                    var index = scope.selectedItems.indexOf(_item);
                    return index == -1 ? false : true;
                }
            }

            scope.toggleSelect = function (item) {
                if (!scope.hasEqualOverride) {
                    if (scope.isSelected(item) == false) {
                        scope.selectedItems.push(item);
                    }
                    else {
                        scope.selectedItems.splice(scope.selectedItems.indexOf(item), 1);
                    }
                }
                else {
                    //for custom equality use row click function
                    scope.gridRowClick(item)
                }
            }

            scope.checkAction = function (_action) {
                return scope.actions({ action: _action })
            }

            scope.customAction = function (_item) {
                scope.customActionFn({ item: _item })
            }

            scope.editGridItem = function (_item) {
                scope.editItem({ item: _item });
            }

            scope.deleteGridItem = function (_item) {
                scope.deleteItem({ item: _item });
            }

            scope.viewGridItemDetails = function (_item) {
                scope.viewItemDetails({ item: _item });
            }

            scope.viewGridItemDetailsInTab = function (_item) {
                scope.viewItemDetailsInTab({ item: _item });
            }

            scope.$watch('gridItems', function () {
                scope.filtering();
            }, true);

            scope.setPageSize = function (size) {
                scope.pageSize = size;
                scope.page = 0;
                scope.pagination();
            };

            scope.firstPage = function () {
                scope.page = 0;
            };

            scope.previousPage = function () {
                if (scope.page > 0) {
                    scope.page--;
                }
            };

            scope.nextPage = function () {
                if (scope.page < scope.pages.length - 1) {
                    scope.page++;
                }
            };

            scope.lastPage = function () {
                scope.page = scope.pages.length - 1;
            };

            scope.filtering = function () {
                if (scope.gridFilter === '') {
                    scope.items = scope.gridItems;
                }
                else {
                    var tmp = $filter('filter')(scope.gridItems, { $: scope.gridFilter });
                    scope.items = tmp;
                }
                scope.pagination();
                scope.page = 0
            };
            
            scope.groups = [];

            scope.grouping = function () {
                var property = scope.groupBy;
                scope.groups = [];
                var item;
                var prop;

                for (var i in scope.items) {
                    item = scope.items[i];
                    prop = scope.getValue(item, property);
                    if (prop === undefined) {
                        prop = '';
                    }

                    var group = commonUtilities.filterById(scope.groups, prop);

                    if (!group) {
                        group = { Id: prop, items: [] };
                        scope.groups.push(group);
                    }

                    group.items.push(item);
                }

                scope.groups.sort(dynamicSort('Id'));
            };

            scope.pagination = function () {
                scope.grouping();
                scope.pages = [];
                if (scope.pageSize == 0) {
                    scope.pages[0] = scope.items;
                }
                else if (scope.items != undefined) {
                    var count = 0;

                    for (var g in scope.groups) {
                        var group = scope.groups[g];
                        var items = group.items;
                        
                        for (var i = 0; i < items.length; i++) {
                            var p = Math.floor((count + i) / scope.pageSize);

                            if ((count + i) % scope.pageSize === 0) {
                                scope.pages[p] = [];
                            }

                            var page = scope.pages[p];

                            var pg = commonUtilities.filterById(page, group.Id);

                            if (!pg) {
                                pg = { Id: group.Id, items: [] };
                                page.push(pg);
                            }

                            pg.items.push(items[i]);
                        }
                        count += items.length;
                    }
                }
            };
        }
    };
}