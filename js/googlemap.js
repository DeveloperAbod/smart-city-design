let directionsService;
let routeRenderers = [];

// Initialize the Google Maps loader
const loader = new google.maps.plugins.loader.Loader({
    apiKey: "AIzaSyCI1s4gfgAJhKJQA19Ff2Uv4NBwsdXBFpQ",
    version: "weekly",
    libraries: ["places"],
});

loader.load().then(() => {
    // Initialize each map separately with its own search box
    initMap("map1", "search-box1", [
        { start: { lat: 15.341507, lng: 44.169373 }, end: { lat: 15.341740, lng: 44.171052 }, color: "red" }
    ]);

    initMap("map2", "search-box2", [
        { start: { lat: 15.3794, lng: 44.2010 }, end: { lat: 15.3994, lng: 44.2210 }, color: "green" }
    ]);

    initMap("map3", "search-box3", [
        { start: { lat: 15.3694, lng: 44.1910 }, end: { lat: 15.3894, lng: 44.2110 }, color: "blue" }
    ]);
}).catch(e => {
    console.error("Error loading Google Maps: ", e);
});

function initMap(mapId, searchBoxId, routes) {
    const mapElement = document.getElementById(mapId);
    if (!mapElement) {
        console.error(`Map element with id '${mapId}' not found.`);
        return;
    }

    const map = new google.maps.Map(mapElement, {
        zoom: 12,
        center: { lat: 15.3694, lng: 44.1910 },
    });

    directionsService = new google.maps.DirectionsService();

    // Set up routes for this map
    routes.forEach((route, index) => {
        createRoute(route.start, route.end, route.color, map, index);
    });

    // Initialize the search box for this specific map
    const input = document.getElementById(searchBoxId);
    const searchBox = new google.maps.places.SearchBox(input);

    // Set bounds for search box to match the map bounds
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    // When a place is selected from the search box, pan to its location
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        map.panTo(place.geometry.location);
        map.setZoom(15);
    });
}

function createRoute(start, end, color, map, index) {
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
            console.error(`Could not display directions for route ${index} on map due to: ${status}`);
        }
    });
}
