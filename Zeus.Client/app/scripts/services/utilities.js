(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('commonUtilities', utilities);

    utilities.$inject = ['$filter', '$route'];

    function utilities($filter, $route) {

        var service = {
            containsById: containsById,
            filterById: filterById,
            filter: filter,
            naturalSort: naturalSort,
            routeExists : routeExists
        };

        return service;

        function routeExists(url) {
            url = url.replace('#/', '/');
            for (var i in $route.routes) {
                var route = $route.routes[i];

                if (route.originalPath === url) {
                    return true;
                }
            }

            return false;
        }

        function containsById(collection, id) {
            return filterById(collection, id) ? true : false;
        }

        function filterById(collection, id) {
            return $filter('filter')(collection, function (o) { return o.Id == id })[0];
        }

        function filter(collection, criteria) {
            return collection.filter(function (o) {
                return Object.keys(criteria).every(function (p) {
                    return o[p] == criteria[p];
                });
            });
        }

        function naturalSort(a, b) {
            if(a == null || a == undefined)
                a='';
            if(b == null || b == undefined)
                b='';

            if (typeof a === 'number' || typeof b === 'number') {
                return a > b;
            }
            if (typeof a === 'boolean' || typeof b === 'boolean') {
                return a > b;
            }

            var aa = chunkify(a);
            var bb = chunkify(b);

            for (var x = 0; aa[x] && bb[x]; x++) {
                if (aa[x] !== bb[x]) {
                    var c = Number(aa[x]), d = Number(bb[x]);
                    if (c == aa[x] && d == bb[x]) {
                        return c - d;
                    }
                    else {
                        return (aa[x] > bb[x]) ? 1 : -1;
                    }
                }
                
            }

            return aa.length - bb.length;
        }

        function chunkify(t) {
            var tz = [], x = 0, y = -1, n = 0, i, j;

            while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                var m = (i == 46 || (i >= 48 && i <= 57));
                if (m !== n) {
                    tz[++y] = "";
                    n = m;
                }
                tz[y] += j;
            }
            return tz;
        }

    }
})();