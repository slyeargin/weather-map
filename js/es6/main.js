(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    initMap(40, -95, 4);
    $('#get').click(getValue);
  }
  var charts = {};
  function getValue() {
    var zip = $('#zip').val().trim();
    getWeather(zip);
    showMap(zip);
    $('#zip').val('');
  }
  function getWeather(zip) {
    var url = ("http://api.wunderground.com/api/259ccbf628d30983/forecast10day/q/" + zip + ".json?callback=?");
    $.getJSON(url, (function(data) {
      $('#graphs').append('<div class=graph data-zip=' + zip + '></div>');
      initGraph(zip);
      data.forecast.simpleforecast.forecastday.forEach((function(m) {
        return charts[$traceurRuntime.toProperty(zip)].dataProvider.push({
          date: m.date.weekday_short,
          high: m.high.fahrenheit * 1,
          low: m.low.fahrenheit * 1
        });
      }));
      charts[$traceurRuntime.toProperty(zip)].validateData();
    }));
  }
  function initGraph(zip) {
    var graph = $('.graph[data-zip=' + zip + ']')[0];
    $traceurRuntime.setProperty(charts, zip, AmCharts.makeChart(graph, {
      'type': 'serial',
      'theme': 'dark',
      'pathToImages': 'http://www.amcharts.com/lib/3/images/',
      'titles': [{
        'text': zip,
        'size': 15
      }],
      'legend': {'useGraphSettings': true},
      'dataProvider': [],
      'valueAxes': [{
        'id': 'v1',
        'minimum': 0,
        'maximum': 100,
        'axisColor': '#FF6600',
        'axisThickness': 2,
        'gridAlpha': 0,
        'axisAlpha': 1,
        'position': 'left'
      }],
      'graphs': [{
        'valueAxis': 'v1',
        'lineColor': '#FF6600',
        'bullet': 'round',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'Low Temps',
        'valueField': 'low',
        'fillAlphas': 0
      }, {
        'valueAxis': 'v1',
        'lineColor': '#B0DE09',
        'bullet': 'triangleUp',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'High Temps',
        'valueField': 'high',
        'fillAlphas': 0
      }],
      'chartCursor': {'cursorPosition': 'mouse'},
      'categoryField': 'date',
      'categoryAxis': {
        'axisColor': '#DADADA',
        'minorGridEnabled': true
      }
    }));
  }
  function showMap(zip) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: zip}, (function(results, status) {
      var name = results[0].formatted_address;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      addMarker(lat, lng, name);
    }));
  }
  function addMarker(lat, lng, name) {
    var flagImg = arguments[3] !== (void 0) ? arguments[3] : './media/flag_blue.png';
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({
      map: map,
      position: latLng,
      title: name,
      icon: flagImg
    });
  }
  var map;
  function initMap(lat, lng, zoom) {
    var styles = [{
      'featureType': 'landscape.natural',
      'elementType': 'geometry.fill',
      'stylers': [{'visibility': 'on'}, {'color': '#e0efef'}]
    }, {
      'featureType': 'poi',
      'elementType': 'geometry.fill',
      'stylers': [{'visibility': 'on'}, {'hue': '#1900ff'}, {'color': '#c0e8e8'}]
    }, {
      'featureType': 'landscape.man_made',
      'elementType': 'geometry.fill'
    }, {
      'featureType': 'road',
      'elementType': 'geometry',
      'stylers': [{'lightness': 100}, {'visibility': 'simplified'}]
    }, {
      'featureType': 'road',
      'elementType': 'labels',
      'stylers': [{'visibility': 'off'}]
    }, {
      'featureType': 'water',
      'stylers': [{'color': '#7dcdcd'}]
    }, {
      'featureType': 'transit.line',
      'elementType': 'geometry',
      'stylers': [{'visibility': 'on'}, {'lightness': 700}]
    }];
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
})();

//# sourceMappingURL=main.map
