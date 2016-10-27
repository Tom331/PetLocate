
(function (window, ng) {
    ng.module('app', ['uiGmapgoogle-maps', 'ui.router', 'ngMaterial'])



  .config(function ($stateProvider) { //had: , $stateChangeError included in the function parameters, but that caused error 
      $stateProvider.state('getLocation', {
          url: '/getLocation',
          templateUrl: 'getlocation.html', 
          controller: 'GetlocationCtrl',
      });
  })



    .controller('GetlocationCtrl', ['$scope', "uiGmapLogger", "uiGmapGoogleMapApi", "$state", "$stateParams", "$timeout", "$mdDialog", "$location",
      function ($scope, $log, GoogleMapApi, $state, $stateParams, $timeout, $mdDialog, $location) { //had $event included to get rid of error but it messed up app
          $log.currentLevel = $log.LEVELS.debug;
          center = { latitude: 49.22, longitude: -122.66 }; //default center
          

          console.log($stateParams);



          $scope.map = {
              center: center,
              pan: false,
              zoom: 16,
              refresh: false,
              events: 
          {    click: function newCenter(mapModel, eventName, originalEventArgs)
          {
            $scope.$apply(function(){
              var e = originalEventArgs[0];
              $scope.map.center = { latitude: e.latLng.lat(), longitude: e.latLng.lng() };
              $scope.showConfirm($event);
              $log.debug(JSON.stringify($scope.map.center));
            });
          }
          }

          }

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
          };




  $scope.showConfirm = function (ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Use this as {{petsName}}\'s last known location?')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('Choose another location');

    $mdDialog.show(confirm).then(function() {
      $location.url($location.path() + "/49.22/-122.66");
      location.reload();
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };

      } ]); //end of controller


      //THIS LISTENER DOES NOT DO ANYTHING
//      $scope.map.event.addListener(map, 'click', function(event) {
//    alert(event.latLng);  // in event.latLng  you have the coordinates of click
//});

//function confirmLocation() {
//    alert('Use this location as {{petName}}\'s last location?')
//}

})(window, angular);