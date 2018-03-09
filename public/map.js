var map, places
var markers = []
var geocoder
var autocomplete
var countryRestrict = { country: "us" }
var MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green"
var hostnameRegexp = new RegExp("^https?://.+?/")

var countries = {
  au: {
    center: { lat: -25.3, lng: 133.8 },
    zoom: 4
  },
  br: {
    center: { lat: -14.2, lng: -51.9 },
    zoom: 3
  },
  ca: {
    center: { lat: 62, lng: -110.0 },
    zoom: 3
  },
  fr: {
    center: { lat: 46.2, lng: 2.2 },
    zoom: 5
  },
  de: {
    center: { lat: 51.2, lng: 10.4 },
    zoom: 5
  },
  mx: {
    center: { lat: 23.6, lng: -102.5 },
    zoom: 4
  },
  nz: {
    center: { lat: -40.9, lng: 174.9 },
    zoom: 5
  },
  it: {
    center: { lat: 41.9, lng: 12.6 },
    zoom: 5
  },
  za: {
    center: { lat: -30.6, lng: 22.9 },
    zoom: 5
  },
  es: {
    center: { lat: 40.5, lng: -3.7 },
    zoom: 5
  },
  pt: {
    center: { lat: 39.4, lng: -8.2 },
    zoom: 6
  },
  us: {
    center: { lat: 37.1, lng: -95.7 },
    zoom: 3
  },
  uk: {
    center: { lat: 54.8, lng: -4.6 },
    zoom: 5
  }
}

function initMap() {
  var styledMapType = new google.maps.StyledMapType([
    { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [{ color: "#4b6878" }]
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#64779e" }]
    },
    {
      featureType: "administrative.neighborhood",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [{ color: "#4b6878" }]
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [{ color: "#334e87" }]
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [{ color: "#023e58" }]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#283d6a" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6f9ba5" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }]
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#023e58" }]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#3C7680" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#304a7d" }]
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#98a5be" }]
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }]
    },
    {
      featureType: "road.arterial",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#2c6675" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#255763" }]
    },
    {
      featureType: "road.highway",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#b0d5ce" }]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#023e58" }]
    },
    {
      featureType: "road.local",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [{ color: "#98a5be" }]
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }]
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [{ color: "#283d6a" }]
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#3a4762" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0e1626" }]
    },
    {
      featureType: "water",
      elementType: "labels.text",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#4e6d70" }]
    }
  ])

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: countries["us"].zoom,
    center: countries["us"].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"]
    }
  })

  map.mapTypes.set("styled_map", styledMapType)
  map.setMapTypeId("styled_map")

  const infoWindow = new google.maps.InfoWindow({
    content: document.getElementById("info-content")
  })

  geocoder = new google.maps.Geocoder()

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */ (document.getElementById("autocomplete")),
    {
      types: ["(cities)"],
      componentRestrictions: countryRestrict
    }
  )
  places = new google.maps.places.PlacesService(map)
  console.log(places)

  autocomplete.addListener("place_changed", onPlaceChanged)

  // Add a DOM event listener to react when the user selects a country.
  document
    .getElementById("country")
    .addEventListener("change", setAutocompleteCountry)
}

// function codeAddress(address) {
//   geocoder.geocode({ address: address }, function(results, status) {
//     if (status == "OK") {
//       map.setCenter(results[0].geometry.location)
//       var marker = new google.maps.Marker({
//         map: map,
//         position: results[0].geometry.location
//       })
//     } else {
//       console.log("Geocode was not successful for the following reason: " + status)
//     }
//   })
//   showGatheringForm();
// }

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  var place = autocomplete.getPlace()
  if (place.geometry) {
    map.panTo(place.geometry.location)
    map.setZoom(15)
    setGatheringMarkers()
    search()
  } else {
    document.getElementById("autocomplete").placeholder = "Enter a city"
  }
}

// Search for hotels in the selected city, within the viewport of the map.
function search() {
  var search = {
    bounds: map.getBounds(),
    types: ["restaurant"]
  }

  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults()
      clearMarkers()
      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode("A".charCodeAt(0) + i % 26)
        var markerIcon = MARKER_PATH + markerLetter + ".png"

        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        })

        // If the user clicks a restaurant marker, show the details of that restaurant
        // in an info window.
        markers[i].placeResult = results[i]
        google.maps.event.addListener(markers[i], "click", showInfoWindow)
        setTimeout(dropMarker(i), i * 100)
        addResult(results[i], i)
      }
    }
  })
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null)
    }
  }
  markers = []
}

// Set the country restriction based on user input.
// Also center and zoom the map on the given country.
function setAutocompleteCountry() {
  var country = document.getElementById("country").value
  if (country == "all") {
    autocomplete.setComponentRestrictions({ country: [] })
    map.setCenter({ lat: 15, lng: 0 })
    map.setZoom(2)
  } else {
    autocomplete.setComponentRestrictions({ country: country })
    map.setCenter(countries[country].center)
    map.setZoom(countries[country].zoom)
  }
  clearResults()
  clearMarkers()
}

function dropMarker(i) {
  return function() {
    markers[i].setMap(map)
  }
}

function addResult(result, i) {
  var results = document.getElementById("results")
  var markerLetter = String.fromCharCode("A".charCodeAt(0) + i % 26)
  var markerIcon = MARKER_PATH + markerLetter + ".png"

  var tr = document.createElement("tr")
  tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF"
  tr.onclick = function() {
    google.maps.event.trigger(markers[i], "click")
  }

  var iconTd = document.createElement("td")
  var nameTd = document.createElement("td")
  var icon = document.createElement("img")
  icon.src = markerIcon
  icon.setAttribute("class", "placeIcon")
  icon.setAttribute("className", "placeIcon")
  var name = document.createTextNode(result.name)
  iconTd.appendChild(icon)
  nameTd.appendChild(name)
  tr.appendChild(iconTd)
  tr.appendChild(nameTd)
  results.appendChild(tr)
}

function clearResults() {
  var results = document.getElementById("results")
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0])
  }
}

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  var marker = this
  places.getDetails({ placeId: marker.placeResult.place_id }, function(
    place,
    status
  ) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return
    }
    const infoWindow = new google.maps.InfoWindow({
      content: document.getElementById("info-content")
    })

    infoWindow.open(map, marker)
    buildIWContent(place, infoWindow)
  })
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place, infoWindow) {
  document.getElementById("iw-icon").innerHTML =
    '<img class="restaurantIcon" ' + 'src="' + place.icon + '"/>'
  document.getElementById("iw-url").innerHTML =
    '<b><a href="' + place.url + '">' + place.name + "</a></b>"
  document.getElementById("iw-address").textContent = place.vicinity

  if (place.formatted_phone_number) {
    document.getElementById("iw-phone-row").style.display = ""
    document.getElementById("iw-phone").textContent =
      place.formatted_phone_number
  } else {
    document.getElementById("iw-phone-row").style.display = "none"
  }

  // Assign a five-star rating to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    var ratingHtml = ""
    for (var i = 0; i < 5; i++) {
      if (place.rating < i + 0.5) {
        ratingHtml += "&#10025;"
      } else {
        ratingHtml += "&#10029;"
      }
      document.getElementById("iw-rating-row").style.display = ""
      document.getElementById("iw-rating").innerHTML = ratingHtml
    }
  } else {
    document.getElementById("iw-rating-row").style.display = "none"
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    var fullUrl = place.website
    var website = hostnameRegexp.exec(place.website)
    if (website === null) {
      website = "http://" + place.website + "/"
      fullUrl = website
    }
    document.getElementById("iw-website-row").style.display = ""
    document.getElementById("iw-website").textContent = website
  } else {
    document.getElementById("iw-website-row").style.display = "none"
  }

  var button = document.getElementById("gather-button")
  button.addEventListener("click", function() {
    createGatheringMarker(place, infoWindow)
  })
}

function createGatheringMarker(place, infoWindow) {
  console.log(place)
  var address = place.formatted_address

  console.log(address)

  infoWindow.close(map, this)

  geocoder.geocode({ address: address }, function(results, status) {
    if (status == "OK") {
      map.setCenter(results[0].geometry.location)
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      })
      showGatheringForm(marker)
    }
  })
}

function showGatheringForm(marker) {
  $("#gathering-form").show()

  const infoWindow = new google.maps.InfoWindow({
    content: document.getElementById("gathering-form")
  })

  infoWindow.open(map, marker)
}

function setGatheringMarkers() {}

function myGatherings() {
  $.ajax({
    method: "GET",
    url: "/gatherings/my",
    success: displayGatherings
  })
}

function setGatheringMarkers() {
  map.data.loadGeoJson("")
}

function displayGatherings(data) {
  var bounds = new google.maps.LatLngBounds()
  const gatheringsElement = data.gatherings.map(function(gathering) {
    let element = $(gatheringTemplate)
    element.attr("id", gathering.id)
    element.find(".gathering-title").text(gathering.title)
    element.find(".number-attending").text(gathering.attending)
    element.find(".gathering-restaurant").text(gathering.restaurant)
    element.find(".gathering-address").text(gathering.address)
    element.find(".gathering-date").text(gathering.date)
    element.find(".gathering-time").text(gathering.time)
    const location = new google.maps.LatLng({
      lat: gathering.lat,
      lng: gathering.lng
    })
    var marker = new google.maps.Marker({
      map: map,
      position: location
    })
    bounds.extend(marker.position)
    return element
  })
  map.fitBounds(bounds)
  $(".gatherings").html(gatheringsElement)
}

function displaySingleGathering(data) {
  const location = new google.maps.LatLng({
    lat: data.lat,
    lng: data.lng
  })
  var marker = new google.maps.Marker({
    map: map,
    position: location
  })
  map.setCenter(location)
}

function handleGatheringAdd() {
  console.log("preparing to add")
  $(".gathering-form").submit(function(e) {
    e.preventDefault()
    const address = $(this)
      .find("#address")
      .val()
    const title = $(this)
      .find("#title")
      .val()
    const restaurant = $(this)
      .find("#restaurant")
      .val()
    const date = $(this)
      .find("#date")
      .val()
    const time = $(this)
      .find("#time")
      .val()

    geocoder.geocode({ address: address }, function(results, status) {
      addGathering({
        lng: results[0].geometry.location.lng(),
        lat: results[0].geometry.location.lat(),
        address: results[0].formatted_address,
        date: date,
        time: time,
        restaurant: restaurant,
        title: title
      })
      $("#title").val("")
      $("#restaurant").val("")
      $("#address").val("")
      $("#date").val("")
      $("#time").val("")
    })
  })
}

function addGathering(gathering) {
  console.log("Adding gathering: " + gathering)
  $.ajax({
    method: "POST",
    url: GATHERINGS_URL,
    data: JSON.stringify(gathering),
    success: displaySingleGathering
  })
}

function deleteGathering(gatheringId) {
  console.log("Deleting gathering`" + gatheringId + "`")
  $.ajax({
    url: GATHERINGS_URL + "/" + gatheringId,
    method: "DELETE",
    success: getAndDisplayGatherings
  })
}

function updateGathering(gathering) {
  console.log("Updating gathering`" + gathering.id + "`")
  $.ajax({
    url: GATHERINGS_URL + "/" + gathering.id,
    method: "PUT",
    data: gathering,
    success: function(data) {
      getAndDisplayGatherings()
    }
  })
}

// $(function() {
//   setupAjax()
//   myGatherings()
//   handleGatheringAdd()
// })
