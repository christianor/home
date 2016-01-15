var tempMon = angular.module('tempMon', ['chart.js']);

tempMon.controller('ChartController', ['$scope', 'TemperatureService', 
	function ($scope, TemperatureService) {

		TemperatureService.getMessungen().then(function (messungen) {
			$scope.labels = messungen.labels;
			$scope.data = messungen.data;
			$scope.series = messungen.series;
		});

		$scope.onClick = function (points, evt) {
			console.log(points, evt);
		};
}]);

tempMon.controller('NewestMeasurementController', ['$scope', 'TemperatureService',
	function ($scope, TemperatureService) {
		TemperatureService.getNewestMessung().then(function (messung) {
			$scope.tempInside = messung.temperatur;
			$scope.tempRelInside = messung.temperatur_gefuehlt;
			$scope.moistnessInside = messung.feuchtigkeit;

			$scope.tempOutside = messung.temperatur_aussen;
			$scope.moistnessOutside = messung.feuchtigkeit_aussen;
		});
	}]);

tempMon.service('TemperatureService', ['$http', '$q', function ($http, $q) {
	var service = {};

	service.url = 'http://home-ortiz.rhcloud.com/api/';
	service.getMessungen = function () 
	{
		return $http({ method: 'GET', url: this.url + 'messungen' }).then(function (response) {
	    	// map data
	    	var messungen = {};
	    	messungen.labels = [];
	    	messungen.series = ['Wohnzimmer', 'Gefuehlt', 'Aussen'];
	    	messungen.data = [[], [], []];
			angular.forEach(response.data, function(value, key){
				var zeit = new Date(value.zeit);
				messungen.labels.push(zeit.getHours() + ":" + (zeit.getMinutes() < 10 ? "0" : "" ) + zeit.getMinutes());
				messungen.data[0].push(value.temperatur);
				messungen.data[1].push(value.temperatur_gefuehlt);
				if (!value.temperatur_aussen)
					messungen.data[2].push(0);
				else
					messungen.data[2].push(value.temperatur_aussen);
			});

	    	return messungen;
	  	});
	}
	service.getNewestMessung = function () 
	{
		return $http({ method: 'GET', url: this.url + 'messungen/current' }).then(function (response) {
	    	return response.data;
	  	});
	}
	return service;
}]);