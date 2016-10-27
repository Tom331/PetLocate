var map = null;
var markers = [];
var custCenter = {};

function initMap()
{
    var startingCenter = { lat: 49.22, lng: -122.66 };
    custCenter = { lat: 49.22, lng: -122.66 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: custCenter,
        mapTypeId: 'terrain'
    });

    // This event listener will call addMarker() when the map is clicked.
    map.addListener('click', function (event) {
        var myLatLng = event.latLng;

        deleteMarkers();
        addMarker(myLatLng);

        window.lat = myLatLng.lat();
        window.lng = myLatLng.lng();
        custCenter = { lat: window.lat, lng: window.lng}
        alert(JSON.stringify(custCenter));  
    });

    // Adds a marker at the center of the map.
    addMarker(custCenter);
}

// Adds a marker to the map and push to the array.
function addMarker(location) 
{
    var marker = new google.maps.Marker({
        position: location,
        map: map                
    });            

    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map); 
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}