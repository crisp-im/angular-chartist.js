(function(angular){
  'use strict';

  var angularChartistModule = angular.module('angularChartist', []);

  var AngularChartistCtrl = function () {
    function AngularChartistCtrlClass($scope, $element) {
      'ngInject';
      this.data = $scope.data;
      this.chartType = $scope.chartType;

      this.events = $scope.events() || {};
      this.options = $scope.chartOptions() || null;
      this.responsiveOptions = $scope.responsiveOptions() || null;

      this.element = $element[0];

      this.renderChart();

      $scope.$watch(
        () => {
          return {
            data: $scope.data,
            chartType: $scope.chartType,
            chartOptions: $scope.chartOptions() || null,
            responsiveOptions: $scope.responsiveOptions() || null,
            events: $scope.events() || {}
          };
        },
        this.update.bind(this),
        true
      );

      $scope.$on('$destroy', () => {
        if (this.chart) {
          this.chart.detach();
        }
      });
    }

    AngularChartistCtrlClass.prototype.bindEvents = function() {
      Object.keys(this.events).forEach(eventName => {
        this.chart.on(eventName, this.events[eventName]);
      });
    }

    AngularChartistCtrlClass.prototype.unbindEvents = function(events) {
      Object.keys(events).forEach(eventName => {
        this.chart.off(eventName, events[eventName]);
      });
    }

    AngularChartistCtrlClass.prototype.renderChart = function() {
      // ensure that the chart does not get created without data
      if (this.data) {
        this.chart = Chartist[this.chartType](this.element, this.data, this.options, this.responsiveOptions);

        this.bindEvents();

        return this.chart;
      }
    }

    AngularChartistCtrlClass.prototype.update = function(newConfig, oldConfig) {
      // Update controller with new configuration
      this.chartType = newConfig.chartType;
      this.data = newConfig.data;
      this.options = newConfig.chartOptions;
      this.responsiveOptions = newConfig.responsiveOptions;
      this.events = newConfig.events;

      // If chart type changed we need to recreate whole chart, otherwise we can update
      if (!this.chart || newConfig.chartType !== oldConfig.chartType) {
        this.renderChart();
      } else {
        if (!angular.equals(newConfig.events, oldConfig.events)) {
          this.unbindEvents(oldConfig.events);
          this.bindEvents();
        }
        this.chart.update(this.data, this.options);
      }
    }

    return AngularChartistCtrlClass;
  }();

  angularChartistModule.controller('AngularChartistCtrl', AngularChartistCtrl).directive('chartist', function () {
    'ngInject';

    return {
      restrict: 'EA',
      scope: {
        // mandatory
        data: '=chartistData',
        chartType: '@chartistChartType',
        // optional
        events: '&chartistEvents',
        chartOptions: '&chartistChartOptions',
        responsiveOptions: '&chartistResponsiveOptions'
      },
      controller: 'AngularChartistCtrl'
    };
  });
}(angular));
