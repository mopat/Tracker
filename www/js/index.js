/**
 * Created by Patrick on 10.05.2016.
 */

function init() {
    document.addEventListener("deviceready", onDeviceReady, false);
    var lat = null,
        long = null;
    var track = [];
    var map = null;
    var locationRefresh = null;
    var emulate = true;

    function onDeviceReady() {
        var startTra = document.getElementById("startTracking"),
         stopTra= document.getElementById("stopTracking");
        startTra.addEventListener("click", function () {
        startTracking();
        });
        stopTra.addEventListener("click", function () {
            pauseTracking();
        });
        var debug = document.getElementById("debug");
        var distance = document.getElementById("distance");

        var resetButton = document.getElementById("resetButton");
        resetButton.addEventListener("click", function () {
            track = [];
            distance.innerHTML = "0";
        });

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
        //startTracking();
    }

    function startTracking() {
        cordova.plugins.backgroundMode.enable();
        appendLocation();
    }

    function pauseTracking() {
        cordova.plugins.backgroundMode.disable();
        clearInterval(locationRefresh);
        locationRefresh = null;
    }

    function appendLocation() {
        locationRefresh = setInterval(function () {
            navigator.geolocation.getCurrentPosition(function (position) {
                // var lat = position.coords.latitude;
                //var long = position.coords.longitude;
                if(document.getElementById("emulate").checked){
                    lat = lat + 0.00001;
                    long = long + 0.00001;
                }
                else{
                   lat = position.coords.latitude;
                    long = position.coords.longitude;
                }

                //alert("lat: " + position.coords.latitude + ", long:" + position.coords.longitude);
                console.log(lat, long)

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

        distance.innerHTML = polyLengthInMeters;
        flightPath.setMap(map);
    }
}

