
var _googleMaps = (function() {

    var map;
    var mapAPI = {};
        mapAPI.mapOptions = {
            center: { lat: -34.397, lng: 150.644},
            zoom: 8
        };

    function angleBetweenTwoPoints(lat1, lng1, lat2, lng2) {
        var point1 = new google.maps.LatLng(lat1, lng1);
        var point2 = new google.maps.LatLng(lat2, lng2);
        var heading = google.maps.geometry.spherical.computeHeading(point1,point2);
        return heading;
    }

    function setupMap() {
        map = new google.maps.Map(document.getElementById('map'),
            mapAPI.mapOptions);

    }

    var me = {};

    me.init = function() {
        setupMap();
    };

    me.findDirections = function() {

        var request = {
          origin: "Doncaster",
          destination: "Sheffield",
          travelMode: google.maps.TravelMode.TRANSIT,
          transitOptions: {modes: [google.maps.TransitMode.TRAIN]}
        };

        var directionsService = new google.maps.DirectionsService();

        directionsService.route (request, function (result, status) {
            alert(status);
            if (status == google.maps.DirectionsStatus.OK)
            {
               
                var pointsArray = [];

                pointsArray = result.routes[0].overview_path;
                console.log(pointsArray);
            }
        });
    };

    me.angleBetweenTwoPoints = function(lat1, lng1, lat2, lng2) {
        return angleBetweenTwoPoints(lat1, lng1, lat2, lng2)
    }

    return me;
}());

window.init = function() {
    _googleMaps.init();
}

