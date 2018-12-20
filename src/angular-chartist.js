(function(angular){
  'use strict';

  var angularChartistModule = angular.module('angular-chartist', []);

  var AngularChartistCtrl = function () {
    function AngularChartistCtrl($scope, $element) {
      'ngInject';

      var _this = this;

      _classCallCheck(this, AngularChartistCtrl);

      this.data = $scope.data;
      this.chartType = $scope.chartType;

      this.events = $scope.events() || {};
      this.options = $scope.chartOptions() || null;
      this.responsiveOptions = $scope.responsiveOptions() || null;

      this.element = $element[0];

      this.renderChart();

      $scope.$watch(function () {
        return {
          data: $scope.data,
          chartType: $scope.chartType,
          chartOptions: $scope.chartOptions() || null,
          responsiveOptions: $scope.responsiveOptions() || null,
          events: $scope.events() || {}
        };
      }, this.update.bind(this), true);

      $scope.$on('$destroy', function () {
        if (_this.chart) {
          _this.chart.detach();
        }
      });
    }

    _createClass(AngularChartistCtrl, [{
      key: 'bindEvents',
      value: function bindEvents() {
        var _this2 = this;

        Object.keys(this.events).forEach(function (eventName) {
          _this2.chart.on(eventName, _this2.events[eventName]);
        });
      }
    }, {
      key: 'unbindEvents',
      value: function unbindEvents(events) {
        var _this3 = this;

        Object.keys(events).forEach(function (eventName) {
          _this3.chart.off(eventName, events[eventName]);
        });
      }
    }, {
      key: 'renderChart',
      value: function renderChart() {
        // ensure that the chart does not get created without data
        if (this.data) {
          this.chart = Chartist[this.chartType](this.element, this.data, this.options, this.responsiveOptions);

          this.bindEvents();

          return this.chart;
        }
      }
    }, {
      key: 'update',
      value: function update(newConfig, oldConfig) {
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
    }]);

    return AngularChartistCtrl;
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
