/* global google:true */
/* global AmCharts:true */
/* jshint unused:false */
/* jshint camelcase:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    initMap(40, -95, 4);
    $('#get').click(getValue);
  }

  var charts = {};

  function getValue(){
    var zip = $('#zip').val().trim();
    getWeather(zip);
    $('#zip').val('');
  }

  function getWeather(zip){
    var url = `http://api.wunderground.com/api/259ccbf628d30983/forecast10day/q/${zip}.json?callback=?`;
    $.getJSON(url, data=>{
      $('#graphs').append('<h2>'+zip+'</h2><div class=graph data-zip='+zip+'></div>');
      initGraph(zip);
      data.forecast.simpleforecast.forecastday.forEach(m=>{
        charts[zip].dataProvider.push({
          date: m.date.weekday_short,
          high: m.high.fahrenheit * 1,
          low: m.low.fahrenheit * 1
        });
      });
      charts[zip].validateData();
    });
    show(zip);
  }

  function initGraph(zip){
    let graph = $('.graph[data-zip='+zip+']')[0];
    console.log(graph);
    charts[zip] = AmCharts.makeChart(graph, {
      'type': 'serial',
      'theme': 'dark',
      'pathToImages': 'http://www.amcharts.com/lib/3/images/',
      'legend': {
          'useGraphSettings': true
        },
        'dataProvider': [],
        'valueAxes': [{
          'id':'v1',
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
        'chartCursor': {
          'cursorPosition': 'mouse'
        },
        'categoryField': 'date',
        'categoryAxis': {
          'axisColor': '#DADADA',
          'minorGridEnabled': true
        }
      });
  }


  function show(zip){
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: zip}, (results, status)=>{
      let name = results[0].formatted_address;
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      addMarker(lat, lng, name);
    });
  }

  function addMarker(lat, lng, name, flagImg='./media/flag_blue.png'){
    let latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name, icon: flagImg});
  }

  var map;
  function initMap(lat, lng, zoom){
    let styles = [{'featureType':'landscape.natural','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#e0efef'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'hue':'#1900ff'},{'color':'#c0e8e8'}]},{'featureType':'landscape.man_made','elementType':'geometry.fill'},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'water','stylers':[{'color':'#7dcdcd'}]},{'featureType':'transit.line','elementType':'geometry','stylers':[{'visibility':'on'},{'lightness':700}]}];
    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

})();
