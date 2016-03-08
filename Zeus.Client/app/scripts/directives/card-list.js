'use strict';

angular
    .module('zeusclientApp')
    .directive('cardList', function ($templateRequest, $compile, lookupService, messageService) {
        return {
            scope: {
                cards: '=',
                cardTemplate: '@',
                cardClass: '@',
                addCard: '&',
                removeCard: '&',
                lookup: '=?',
                emptyMessage: '@'
            },
            transclude: true,
            templateUrl: '/templates/card-list.html',
            link: function postLink(scope, element, attrs) {
                scope.lookup = lookupService;
                scope.emptyMessage = scope.emptyMessage || "<div class=\"btn-group-sm\">Δεν υπάρχουν κάρτες για προβολή. Πατήστε το κουμπί  <span class=\"btn btn-warning btn-fab fab\"><i class=\"material-icons\">add</i></span>  κάτω δεξιά για να προσθέσετε μια νέα κάρτα</div>";
                scope.removeCard = function (index) {
                    //messageService.askConfirmation(function () { return scope.cards.splice(index, 1); });
                    scope.cards.splice(index, 1);
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



                // issue new report
                scope.issueReport = function (reportType, fid) {
                    $location.url('/reports/' + reportType + '/' + fid + '/new');
                }
            }
        }
    });