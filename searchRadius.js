
(function (window, ng) {
    ng.module('app', ['uiGmapgoogle-maps', 'ui.router'])



  .config(function ($stateProvider) { //had: , $stateChangeError included in the function parameters, but that caused error 
      $stateProvider.state('searchRadius', {
          url: '/:lat/:lon',
          templateUrl: 'searchRadius.html', //changed from  index to searchRadius.html
          controller: 'MapsCtrl',
      });
  })


  ////ALREADY HAVE GOOGLE MAPS KEY ON searchRadius.html
  //  .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  //    GoogleMapApi.configure({
  //        key: 'AIzaSyC_XEbbw3sNm4XlLAgqMJTggeHLDUdV-pY',
  //        v: '3',
  //        libraries: 'weather,geometry,visualization'
  //    });
  //} ])




    .controller('MapsCtrl', ['$scope', "uiGmapLogger", "uiGmapGoogleMapApi", "$interval", "$state", "$stateParams",
      function ($scope, $log, GoogleMapApi, $interval, $state, $stateParams) {
          $log.currentLevel = $log.LEVELS.debug;
          var center = { latitude: parseFloat($stateParams.lat), longitude: parseFloat($stateParams.lon) };
          alert(JSON.stringify(center));
          Object.freeze(center); //caused TypeError: Cannot assign to read only property ('latitude') ...

          console.log($stateParams);

          $scope.map = {
              center: center,
              pan: false,
              zoom: 16,
              refresh: false,
              events: {},
              bounds: {}
          };

          $scope.map.circle = {
              id: 1,
              center: center,
              radius: 500, //(current time - date lost)*km/hour
              stroke: {
                  color: '#08B21F',
                  weight: 2,
                  opacity: 1
              },

              fill: {
                  color: '#08B21F',
                  opacity: 0.5
              },
              geodesic: false, // optional: defaults to false
              draggable: false, // optional: defaults to false
              clickable: true, // optional: defaults to true
              editable: false, // optional: defaults to false
              visible: true, // optional: defaults to true
              events: {
                  dblclick: function () {
                      $log.debug("circle dblclick");
                  },
                  radius_changed: function (gObject) {
                      var radius = gObject.getRadius();
                      $log.debug("circle radius radius_changed " + radius);
                  }
              }
          }

          //Increase Radius:
          $interval(function(){
    			$scope.map.circle.radius += 30; //dynamic var
		  }, 1000); //end of interval function


      } ]); //end of controller

})(window, angular);