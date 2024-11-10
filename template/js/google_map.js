let map;
let directionsService;
let routeRenderers = [];
let searchBox;

// Initialize the Google Maps loader
const loader = new google.maps.plugins.loader.Loader({
    apiKey: "AIzaSyCI1s4gfgAJhKJQA19Ff2Uv4NBwsdXBFpQ",
    version: "weekly",
    libraries: ["places"],
});

loader.load().then(() => {
    initMap();
}).catch(e => {
    console.error("Error loading Google Maps: ", e);
});

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 15.3694, lng: 44.1910 },
    });

    directionsService = new google.maps.DirectionsService();

    const routes = [
        { start: { lat: 15.341507, lng: 44.169373 }, end: { lat: 15.341740, lng: 44.171052 }, color: "red" },
        { start: { lat: 15.3794, lng: 44.2010 }, end: { lat: 15.3994, lng: 44.2210 }, color: "green" }
    ];

    routes.forEach((route, index) => {
        createRoute(route.start, route.end, route.color, index);
    });

    const input = document.getElementById("search-box");
    searchBox = new google.maps.places.SearchBox(input);

    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        map.panTo(place.geometry.location);
        map.setZoom(15);
    });
}

function createRoute(start, end, color, index) {
    const request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            const directionsRenderer = new google.maps.DirectionsRenderer({
                map: map,
                polylineOptions: {
                    strokeColor: color,
                    strokeOpacity: 0.8,
                    strokeWeight: 6,
                },
                suppressMarkers: true,
            });
            directionsRenderer.setDirections(result);
            routeRenderers.push(directionsRenderer);
        } else {
            console.error(`Could not display directions for route ${index} due to: ${status}`);
        }
    });
}
