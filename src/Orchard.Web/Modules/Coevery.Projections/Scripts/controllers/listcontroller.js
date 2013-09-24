﻿'use strict';

define(['core/app/detourService',
        'Modules/Coevery.Projections/Scripts/services/projectiondataservice'], function (detour) {
            detour.registerController([
                'ProjectionListCtrl',
                ['$rootScope', '$scope', 'logger', '$detour', '$resource', '$stateParams', 'projectionDataService',
                    function ($rootScope, $scope, logger, $detour, $resource, $stateParams, projectionDataService) {
                        var t = function (str) {
                            var result = i18n.t(str);
                            return result;
                        };
                        var columnDefs = [
                            { name: 'ContentId', label: t('Content Id'), hidden: true },
                            {
                                name: 'DisplayName', label: t('Display Name'),
                                formatter: $rootScope.cellLinkTemplate,
                                formatoptions: { hasDefault: true }
                            },
                            { name: 'EntityType', label: t('Entity Type') },
                            { name: 'Default', label: t('Default') }];

                        $scope.gridOptions = {
                            url: "api/projections/Projection?id=" + $stateParams.Id,
                            colModel: columnDefs
                        };

                        angular.extend($scope.gridOptions, $rootScope.defaultGridOptions);

                        $scope.exit = function () {
                            $detour.transitionTo('EntityDetail.Fields', { Id: $stateParams.Id });
                        };

                        $scope.delete = function (id) {
                            $scope.viewId = id;
                            $('#myModalView').modal({
                                backdrop: 'static',
                                keyboard: true
                            });
                        };

                        $scope.deleteView = function () {
                            $('#myModalView').modal('hide');
                            projectionDataService.delete({ Id: $scope.viewId }, function () {
                                if ($scope.selectedItems.length != 0) {
                                    $scope.selectedItems.pop();
                                }
                                $scope.getAll();
                                logger.success('Delete the view successful.');
                            }, function (result) {
                                logger.error("Failed to delete the view:" + result.data.Message);
                            });
                        };

                        $scope.add = function () {
                            $detour.transitionTo('ProjectionCreate', { EntityName: $stateParams.Id });
                        };

                        $scope.edit = function (id) {
                            $detour.transitionTo('ProjectionEdit', { EntityName: $stateParams.Id, Id: id });
                        };

                        $scope.setDefault = function (id) {
                            var result = projectionDataService.save({ Id: id, EntityType: $stateParams.Id }, function () {
                                if ($scope.selectedItems.length != 0) {
                                    $scope.selectedItems.pop();
                                }
                                $scope.getAll();
                            }, function () {

                            });
                        };

                        $scope.getAll = function () {
                            $("#viewList").jqGrid('setGridParam', {
                                datatype: "json"
                            }).trigger('reloadGrid');
                        };
                    }]
            ]);
        });

/*Abondoned fields
var records = projectionDataService.query({ Name: $stateParams.Id }, function () {
                                $scope.myData = records;
                            }, function () {
                                logger.error("Failed to fetched projections for " + $stateParams.EntityName);
                            });
*/