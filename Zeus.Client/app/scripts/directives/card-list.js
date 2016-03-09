'use strict';

angular
    .module('zeusclientApp')
    .directive('cardList', function ($templateRequest, $compile, $location, lookupService, messageService) {
        return {
            scope: {
                cards: '=',
                cardTemplate: '@',
                cardClass: '@',
                addCard: '&',
                hideAddButton: '=',
                removeCard: '&',
                lookup: '=?'
            },
            transclude: true,
            templateUrl: '/templates/card-list.html',
            link: function postLink(scope, element, attrs) {
                if (scope.cards == null) { scope.cards = []; }
                scope.lookup = lookupService;

                scope.removeCard = function (index) {
                    //messageService.askConfirmation(function () { return scope.cards.splice(index, 1); });
                    scope.cards.splice(index, 1);
                }

                scope.addFacility = function () {
                    $location.url("/facilities/new");
                }
            }
        };
    })
    .directive('cardListItem', function ($templateRequest, $compile, $location) {
        return {
            transclude: true,
            link: function postLink(scope, element, attrs) {
                $templateRequest(attrs.cardTemplate)
                    .then(function (tplString) {
                        // compile the template then link the result with the scope.
                        var contents = $compile(tplString)(scope);
                        // Insert the compiled, linked element into the DOM
                        element.append(contents);
                    });

                scope.goto = function (path) {
                    $location.url(path);
                }

                // issue new report
                scope.issueReport = function (reportType, fid) {
                    $location.url('/reports/' + reportType + '/' + fid + '/new');
                }

            }
        }
    });