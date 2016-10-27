
//getLocation controller:
(function (window, ng) {
    ng.module('app', ['uiGmapgoogle-maps', 'ui.router', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'sticky', 'moment-picker'])

.config(function ($stateProvider) { //had: , $stateChangeError included in the function parameters, but that caused error 

    $stateProvider

       .state('petType', {
          url: '/petType',
          templateUrl: 'petType.html', //changed from index to searchRadius.html 
          controller: 'PetCtrl'
        })
       .state('getLocation', {
           url: '/petType/:hoursAgo/:speed/getLocation',
           templateUrl: 'getlocation.html',
           controller: 'GetlocationCtrl'
       })

       .state('searchRadius', {
           url: '/petType/:hoursAgo/:speed/getLocation/:lat/:lon',
           templateUrl: 'searchRadius.html',
           controller: 'MapsCtrl'
       })



})




    .config(['momentPickerProvider', function (momentPickerProvider) {
        momentPickerProvider.options({
            /* Picker properties */
            locale: 'en',
            format: 'L LTS',
            minView: 'decade',
            maxView: 'minute',
            startView: 'year',
            autoclose: true,
            today: false,
            keyboard: false,

            /* Extra: Views properties */
            leftArrow: '&larr;',
            rightArrow: '&rarr;',
            yearsFormat: 'YYYY',
            monthsFormat: 'MMM',
            daysFormat: 'D',
            hoursFormat: 'HH:[00]',
            minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
            secondsFormat: 'ss',
            minutesStep: 5,
            secondsStep: 1
        });
    } ])





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
          { click:
                    function newCenter(mapModel, eventName, originalEventArgs) {
                        $scope.$apply(function () {
                            var e = originalEventArgs[0];
                            $scope.map.center = { latitude: e.latLng.lat(), longitude: e.latLng.lng() };
                            $scope.showConfirm($event);
                            $log.debug(JSON.stringify($scope.map.center));
                        });
                    }
          }

          } //SHOULDN'T $SCOPE.MAP INCLUDE $SCOPE.MAP.CIRCLE?? BECAUSE CIRCLE IS PART OF MAP?

          $scope.map.circle = {
              id: 1,
              center: center,
              //radius: 500, //(current time - date lost)*km/hour comment out because it's defined below
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
          .title('Use this as pet\'s last known location?')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('Choose another location');

              $mdDialog.show(confirm).then(function () {
                  $location.url($location.path() + "/" + JSON.stringify($scope.map.center.latitude) + "/" + JSON.stringify($scope.map.center.longitude));
                  location.reload();
              }, function () {
                  $scope.status = 'Old template message';
              });
          }

      } ]) //end of controller


    //THIS LISTENER DOES NOT DO ANYTHING
    //      $scope.map.event.addListener(map, 'click', function(event) {
    //    alert(event.latLng);  // in event.latLng  you have the coordinates of click
    //});

    //function confirmLocation() {
    //    alert('Use this location as {{petName}}\'s last location?')
    //}





    //Start of searchRadius.js controller:

    .controller('MapsCtrl', ['$scope', "uiGmapLogger", "uiGmapGoogleMapApi", "$interval", "$state", "$stateParams",
      function ($scope, $log, GoogleMapApi, $interval, $state, $stateParams) {
          $log.currentLevel = $log.LEVELS.debug;
          var center = { latitude: parseFloat($stateParams.lat), longitude: parseFloat($stateParams.lon) };
          //alert(JSON.stringify(center));
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
          alert(parseFloat($stateParams.hoursAgo) * parseFloat($stateParams.speed))
          $scope.map.circle = {
              id: 1,
              center: center,
              radius: (parseFloat($stateParams.hoursAgo) * parseFloat($stateParams.speed))*1000, //(current time - date lost)*km/hour *3600 to get in m/s
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
          $interval(function () {
              $scope.map.circle.radius += parseFloat(($stateParams.speed *1000)/3600); //dynamic var
          }, 1000); //end of interval function


      } ]) //end of controller




    //Controller for petType.html
.controller ('PetCtrl', ["$scope", "$log", "$location", "$mdDialog", function ($scope, $log, $location, $mdDialog) {

    $scope.activeMenu = '';

    $scope.checkSpeedSet = false;
    $scope.checkDateSet = false;

    $scope.setSpeed = function () {
        if ($scope.activeMenu == 'fast') {
            $scope.speed = 46;
            //alert(speed);
        }

        else if($scope.activeMenu == 'medFast') {
            $scope.speed = 35;
        }

        else if($scope.activeMenu == 'med') {
            $scope.speed = 30;
        }

        else if($scope.activeMenu == 'medSlow') {
            $scope.speed = 23;
        }

        else {
            $scope.speed = 12;
        }

        $log.debug($scope.speed);
        $log.debug($scope.checkSpeedSet);
        $scope.checkSpeedSet = true;
        $log.debug($scope.checkSpeedSet);
        return $scope.speed;
    }

    $scope.setDate = function (dateSelected) {
        var now = new Date();
        $scope.latest = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
        $scope.hoursAgo = Math.round((($scope.latest - dateSelected) / 3600000) * 1000000) / 1000000; 
        if ($scope.hoursAgo === 'undefined' || isNaN($scope.hoursAgo)) {
            alert("Please choose a date/time");
        }
        else if ($scope.hoursAgo < 0) {
            alert("Plan on losing your pet in the future? Shame on you");
        }
        else {
            alert('Your pet was lost ' + $scope.hoursAgo + ' hour(s) ago');
            $scope.checkDateSet = true;
        }

    }




    $scope.goToGetLocation = function () {
        //alert('Function called');
        $location.url($location.path() + "/" + $scope.hoursAgo + "/" + $scope.speed + "/getLocation");
        location.reload();
    }







} ])

})(window, angular);    