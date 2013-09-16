﻿define(['angular-detour', 'core/app/formdesignerservice', 'core/directives/common'], function () {
    'use strict';

    var coevery = angular.module('coevery', ['ng', 'ngGrid', 'ngResource', 'agt.detour', 'ui.utils', 'coevery.formdesigner', 'SharedServices', 'ui.bootstrap', 'coevery.common']);
    coevery.config(['$locationProvider', '$provide', '$detourProvider',
        function ($locationProvider, $provide, $detourProvider) {
            $detourProvider.loader = {
                lazy: {
                    enabled: true,
                    routeUrl: 'api/CoeveryCore/Route',
                    stateUrl: 'api/CoeveryCore/State',
                    routeParameter: 'isFront=false&r'
                },
                crossDomain: true,
                httpMethod: 'GET'
            };
        }]);

    coevery.value('$anchorScroll', angular.noop);

    coevery.run(['$rootScope', '$detour', '$stateParams', '$templateCache',
        function ($rootScope, $detour, $stateParams, $templateCache) {

            //"cheating" so that detour is available in requirejs
            //define modules -- we want run-time registration of components
            //to take place within those modules because it allows
            //for them to have their own dependencies also be lazy-loaded.
            //this is what requirejs is good at.

            //if not using any dependencies properties in detour states,
            //then this is not necessary
            coevery.detour = $detour;

            //the sample reads from the current $detour.state
            //and $stateParams in its templates
            //that it the only reason this is necessary
            $rootScope.$detour = $detour;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on('$viewContentLoaded', function () {
                $(window).scrollTop(0);
            });

            $rootScope.i18nextOptions = {
                resGetPath: 'i18n/__ns_____lng__.json',
                lowerCaseLng: true,
                ns: 'resources-locale'
            };

            function getGridMinHeight(currentGrid) {
                var findGrids = $(".gridStyle.ng-scope.ngGrid");
                var availHeight = window.innerHeight -
                    $("#header").outerHeight(true) -
                    $("#footer").outerHeight(true);
                var currentGridNumber = 0;
                if (isNaN(availHeight)) {
                    alert("Wrong variable used!");
                }

                for (var index = 0; index < findGrids.length; index++) {
                    var tempGrid = findGrids.eq(-index - 1);
                    availHeight -= tempGrid.height();
                    if (tempGrid.find(currentGrid) != 0) {
                        currentGridNumber = index + 1;
                    }
                }

                //Decide whether current grid can use auto minHight;
                if (availHeight < 0 || currentGridNumber > Math.ceil((availHeight - findGrids.last().offset().top) % 100)) {
                    return 150;
                }
                var minHeight = availHeight - currentGrid.offset().top + currentGrid.parent().height();
                if (minHeight < 200) {
                    minHeight = 200;
                }
                return minHeight;
            }

            $rootScope.defaultGridOptions = {
                plugins: [new ngGridFlexibleHeightPlugin({ minHeight: 0 }), new ngGridRowSelectionPlugin()],
                //multiSelect: false,
                //enableRowSelection: true,
                enableColumnResize: true,
                enableColumnReordering: true,
                enablePaging: true,
                showFooter: true,
                totalServerItems: "totalServerItems",
                footerTemplate: 'Coevery/CoeveryCore/GridTemplate/DefaultFooterTemplate'
            };
        }
    ]);

    return coevery;

});

$(function () {
    $('body').on("submit", 'form', function (event) {
        event.preventDefault();
    });
});