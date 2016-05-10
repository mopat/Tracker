/**
 * Created by Patrick on 10.05.2016.
 */

function init() {
    document.addEventListener("deviceready", onDeviceReady, false);
    var lat = null,
        long = null;
    var track = [];
    var map = null;

    function onDeviceReady() {

        cordova.plugins.backgroundMode.enable();

        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            track.push({lat: Number(lat), lng: Number(long)});
            //alert("lat: " + position.coords.latitude + ", long:" + position.coords.longitude);
            console.log(lat, long)
            initMap();
        });
    }

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: {lat: Number(lat), lng: Number(long)},
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            enableHighAccuracy: true
        });
        appendLocation();
        setTrack();
    }


    function appendLocation() {
        setInterval(function () {
            navigator.geolocation.getCurrentPosition(function (position) {
                // var lat = position.coords.latitude;
                //var long = position.coords.longitude;
                lat = lat + 0.00001;
                long = long + 0.00001;
                //alert("lat: " + position.coords.latitude + ", long:" + position.coords.longitude);
                console.log(lat, long)
                var debug = document.getElementById("debug");
                debug.innerHTML = lat + " " + long;
                track.push({lat: Number(lat), lng: Number(long)});
                setTrack();
            });
        }, 3000);
    }

    function setTrack() {
        var flightPath = new google.maps.Polyline({
            path: track,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        var polyLengthInMeters = google.maps.geometry.spherical.computeLength(flightPath.getPath().getArray());
        var distance = document.getElementById("distance");
        distance.innerHTML = polyLengthInMeters;
        flightPath.setMap(map);
    }
}

