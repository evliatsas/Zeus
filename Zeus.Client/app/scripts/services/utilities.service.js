(function () {
    'use strict';

    angular
        .module('zeusclientApp')
        .factory('utilitiesService', utilities);

    function utilities($filter, $route, $window, moment) {

        var service = {
            containsById: containsById,
            filterById: filterById,
            filter: filter,
            naturalSort: naturalSort,
            routeExists : routeExists,
            groupBy: groupBy,
            formatDateTime: formatDateTime,
            goBack: goBack
        };

        return service;

        function formatDateTime(dt, format) {
            var dtf = format || "DD-MM";
            return moment(dt).isValid() ? moment(dt).format(dtf, 'el') : "";
        }

        function groupBy(items, field) {
            var groups = [];
            if (items == null) { return groups; }

            items.forEach(function(item, index) {

                var key = typeof field === "function" ? field(item) : item[field];

                var group = groups.length === 0 ? null : $filter('filter')(groups, function(g) { return g.key == key; })[0];

                if (group == null) {
                    group = {
                        key: key,
                        items: []
                    };
                    groups.push(group);
                }
                group.items.push(item);
            });

            groups.sort(function (a, b) { return a < b; });

            return groups;
        }

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

        function goBack() {
            $window.history.back()
        }
    }
})();