
window.init = function() {

    var _geolocation = (function() {

        var me = {};

        me.getLocation = function() {

            return new Promise(function(resolve, reject) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {

                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;

                        var result = {
                            lat: lat,
                            lng: lng
                        }
                        resolve(result);
                    }, function() {
                        return false;
                    });
                } else {
                    return false;
                }
            });
        };

        return me;

    }());


    var _foursquareAPI = (function() {

        var me = {};

        var options = {};
        options.foursquareKey = "WLSJ5CIP3G3R3KF5WVH10503HM3PXFLG1F1QVLGF23PRNPGZ&v=20150727";

        me.getPlaces = function(lat, lng, radius) {
            return new Promise(function(resolve, reject) {

                var categoryIds = "4deefb944765f83613cdba6e,52e81612bcbc57f1066b79ed,52e81612bcbc57f1066b79ee,52e81612bcbc57f1066b79ee,52e81612bcbc57f1066b7a22,50aaa49e4b90af0d42d5de11,4bf58dd8d48988d15d941735,4eb1d4d54b900d56c88a45fc,52e81612bcbc57f1066b7a21,52e81612bcbc57f1066b7a14,4bf58dd8d48988d12d941735"
                var url = "https://api.foursquare.com/v2/venues/search?oauth_token=" + options.foursquareKey + "&ll=" + lat + "," + lng + "&radius=" + radius + "&categoryId=" + categoryIds + "&intent=browse";
                $.getJSON(url, function(data) {
                    resolve(data.response.venues);
                });
            });
        }

        me.getPlacesPoints = function(points) {

            return new Promise(function(resolve, reject) {
                
                var result = [];
                var end = points.length;
                var count = 0;

                $.each(points, function(key, val) {
                    var places = me.getPlaces(val.lat, val.lng, 9000);
                    places.then(function(places) {
                        count++;
                        result = result.concat(places);
                        if (count == end) {
                            resolve(result);
                        }
          
                    });
                });

            });
        }


        return me;

    }());


    var _googleMaps = (function() {

        var map;
        var mapAPI = {};
        mapAPI.mapOptions = {
        disableDefaultUI: true, // a way to quickly hide all controls
        mapTypeControl: false,
        scaleControl: true,
        panControl: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: {
            lat: 54.610255,
            lng: -5.009766
        },
        zoom: 6,
        styles: [{
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#000000"
            }, {
                "lightness": 40
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 21
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }]


    };

        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var directionsPoints;
        var lines = [];
        var markers = [];

        function angleBetweenTwoPoints(lat1, lng1, lat2, lng2) {
            var point1 = new google.maps.LatLng(lat1, lng1);
            var point2 = new google.maps.LatLng(lat2, lng2);
            var heading = google.maps.geometry.spherical.computeHeading(point1, point2);
            return heading;
        }

        function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1); // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return (d * 1000);
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }

        function setupMap() {
            map = new google.maps.Map(document.getElementById('map'),
                mapAPI.mapOptions);

            var rendererOptions = {
                map: map,
                polylineOptions: {
                    strokeColor: "white",
                    strokeWeight: 5
                }
            };
            directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

        }


        function clearLines(l) {

            if (typeof l != 'undefined') {
                $.each(l, function(key, val) {
                    l[key].setMap(null);
                });
            }

        }

        function clearMarkers() {
            $.each(markers, function(key, val) {
                markers[key].setMap(null);
            });
        }

        var me = {};

        me.init = function() {
            setupMap();
        };

        me.addMarkers = function(places) {
            clearMarkers();
            $.each(places, function(key, val) {
                var lat = val.location.lat;
                var lng = val.location.lng;
                var myLatlng = new google.maps.LatLng(lat,lng);
                var marker = new google.maps.Marker({
                      position: myLatlng,
                      map: map,
                      title: val.name
                });

                markers.push(marker);
            })
        }

        me.findDirections = function(from, to) {

            return new Promise(function(resolve, reject) {

                directionsDisplay.suppressMarkers = true;
                directionsDisplay.suppressInfoWindows = true;

                directionsDisplay.set('directions', null);
                var request = {
                    origin: from,
                    destination: to,
                    travelMode: google.maps.TravelMode.TRANSIT,
                    transitOptions: {
                        modes: [google.maps.TransitMode.TRAIN]
                    }
                };


                directionsService.route(request, function(result, status) {

                    if (status == google.maps.DirectionsStatus.OK) {

                        var pointsArray = [];
                        pointsArray = result.routes[0].overview_path;

                        clearLines(lines);

                        path = new google.maps.Polyline({
                            path: pointsArray,
                            geodesic: true,
                            strokeColor: '#ffffff',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });

                        lines.push(path);

                        var bounds = new google.maps.LatLngBounds();
                        for (var i = 0; i < pointsArray.length; i++) {
                            bounds.extend(pointsArray[i]);
                        }

                        map.fitBounds(bounds);
                        path.setMap(map);
                        resolve(pointsArray);
                    }
                });

            });

        };

        me.getPoints = function(pointsArray) {

            var previous = {};
            var points = [];

            $.each(pointsArray, function(key, val) {

                if (jQuery.isEmptyObject(previous)) {
                    previous = {
                        lat: val.lat(),
                        lng: val.lng()
                    };
                    points.push({
                        lat: val.lat(),
                        lng: val.lng()
                    });
                } else if (getDistanceFromLatLon(val.lat(), val.lng(), previous.lat, previous.lng) > 10000) {
                    previous = {
                        lat: val.lat(),
                        lng: val.lng()
                    };
                    points.push({
                        lat: val.lat(),
                        lng: val.lng()
                    });
                }


            });
             
             return points;
        }

        me.angleBetweenTwoPoints = function(lat1, lng1, lat2, lng2) {
            return angleBetweenTwoPoints(lat1, lng1, lat2, lng2)
        }

        return me;
    }());


    var _mapData = (function() {

    }());

    var _pageUI = (function() {

        function findRoute() {
            var from = $("#routeFrom").val();
            var to = $("#routeTo").val();

            var directions = _googleMaps.findDirections(from, to);

            directions.then(function(data) {
                var points = _foursquareAPI.getPlacesPoints(_googleMaps.getPoints(data));
                points.then(function(places) {
                    _googleMaps.addMarkers(places);
                })
            });
        }



        var me = {};

        me.bindEvents = function() {
            $("#routeSubmit").on("click", findRoute);
        };

        return me;

    }());


    _pageUI.bindEvents();
    _googleMaps.init();

};
