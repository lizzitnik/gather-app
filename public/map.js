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
    zoom: 4
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

  console.log(countries["us"])

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

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  var place = autocomplete.getPlace()
  if (place.geometry) {
    map.panTo(place.geometry.location)
    map.setZoom(15)
    search()
    allGatherings()
    myGatherings()
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
          icon: markerIcon,
          zIndex: -1
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

    buildIWContent(map, marker, place)
  })
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(map, marker, place) {
  console.log(place)

  if (place.rating) {
    var ratingHtml = ""
    for (var i = 0; i < 5; i++) {
      if (place.rating < i + 0.5) {
        ratingHtml += "&#10025;"
      } else {
        ratingHtml += "&#10029;"
      }
    }
  }

  let fullHtml = `
  <table>
            <tr id="iw-url-row" class="iw_table_row">
              <td id="iw-icon" class="iw_table_icon">
                <img class="restaurantIcon" src="${place.icon}"/>
              </td>
              <td id="iw-url">
                <b><a href="${place.url}>${place.name}</a></b>"
              </td>
            </tr>
            <tr id="iw-address-row" class="iw_table_row">
              <td class="iw_attribute_name">Address:
              </td>
              <td id="iw-address">${place.formatted_address}</td>
            </tr>
            <tr id="iw-phone-row" class="iw_table_row">
              <td class="iw_attribute_name">Telephone:</td>
              <td id="iw-phone">${place.formatted_phone_number}</td>
            </tr>
            <tr id="iw-rating-row" class="iw_table_row">
              <td class="iw_attribute_name">Rating:</td>
              <td id="iw-rating">${ratingHtml}</td>
            </tr>
            <tr id="iw-website-row" class="iw_table_row">
              <td class="iw_attribute_name">Website:</td>
              <td id="iw-website">
                <a href='${place.website}'>${place.website}</a>
              </td>
            </tr>
              <td></td>
              <td><button id='gather-button' type='button'>Create Gathering Here!</button></td>
            </tr>
          </table>
  `

  const infoWindow = new google.maps.InfoWindow({
    content: fullHtml
  })

  infoWindow.open(map, marker)

  var button = document.getElementById("gather-button")
  button.addEventListener("click", function() {
    createGatheringMarker(place, infoWindow)
    marker.setMap(null)
  })
}

function createGatheringMarker(place, infoWindow) {
  //console.log(place)
  var address = place.formatted_address
  var restaurant = place.name

  infoWindow.close(map, this)

  geocoder.geocode({ address: address }, function(results, status) {
    if (status == "OK") {
      map.setCenter(results[0].geometry.location)
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      })

      showGatheringForm(marker, address, restaurant)
    }
  })
}

function showGatheringForm(marker, address, restaurant) {
  let gatheringHtml = `<form id='gathering-form'>
        <table>
          <tr>
            <td>Title:</td>
            <td><input type='text' id='title'/></td>
          </tr>
          <tr>
            <td>Restaurant:</td>
            <td><input type='text' id='restaurant' value='${restaurant}'/></td>
          </tr>
          <tr>
            <td>Address:</td>
            <td><input type='text' id='address' value='${address}'/></td>
          </tr>
          <tr>
            <td>Date:</td>
            <td><input type='date' id='date'/></td>
          </tr>
          <tr>
            <td>Time:</td>
            <td><input type='time' id='time'/></td>
          </tr>
        </table>
        <button type='submit' id='save-button'>Save</button>
      </form>`

  const infoWindow = new google.maps.InfoWindow({
    content: gatheringHtml
  })

  infoWindow.open(map, marker)

  var button = document.getElementById("save-button")
  button.addEventListener("click", function(e) {
    e.preventDefault()
    handleGatheringAdd(e, infoWindow)
  })
}

function allGatherings() {
  $.ajax({
    method: "GET",
    url: "/gatherings",
    success: displayGatheringMarkers
  })
}

function displayGatheringMarkers(data) {
  const gatheringsElement = data.gatherings.map(function(gathering) {
    const location = new google.maps.LatLng({
      lat: gathering.lat,
      lng: gathering.lng
    })
    var marker = new google.maps.Marker({
      map: map,
      position: location,
      animation: google.maps.Animation.DROP,
      label: "G"
    })

    let hoverHtml = `
      <h2>${gathering.title}</h2>
      <p>${gathering.address}</p>
      <p>${gathering.restaurant}</p>
      <p>on ${gathering.date} at ${gathering.time}</p>
      <p>Number attending: ${gathering.attending}</p>
      <button >Join Gathering</button>
    `

    const hoverWindow = new google.maps.InfoWindow({
      content: hoverHtml
    })

    marker.addListener("click", function() {
      hoverWindow.open(map, marker)
    })
  })
}

function showGatheringInfo(map, marker, gathering) {
  console.log(gathering)
  // let infoHtml = (`
  //   <h2>
  // `)
}

function myGatherings() {
  $.ajax({
    method: "GET",
    url: "/gatherings/my",
    success: displayMyGatherings
  })
}

function displayMyGatherings(data) {
  // var bounds = new google.maps.LatLngBounds()
  const myGatheringsElement = data.gatherings.map(function(gathering, index) {
    // let element = $(gatheringTemplate)
    // element.attr("id", gathering.id)
    // element.find(".gathering-title").text(gathering.title)
    // element.find(".number-attending").text(gathering.attending)
    // element.find(".gathering-restaurant").text(gathering.restaurant)
    // element.find(".gathering-address").text(gathering.address)
    // element.find(".gathering-date").text(gathering.date)
    // element.find(".gathering-time").text(gathering.time)

    const location = new google.maps.LatLng({
      lat: gathering.lat,
      lng: gathering.lng
    })
    var marker = new google.maps.Marker({
      map: map,
      position: location,
      animation: google.maps.Animation.DROP,
      zIndex: 999
    })

    let hoverHtml = `
      <h3>This is your gathering!</h3>
      <p>${gathering.title} will begin at ${gathering.time} on
      ${gathering.date}</p>
      <p>Number attending: ${gathering.attending}</p>
<<<<<<< HEAD
      <button type='button' id='delete-button-${index}'>Delete Gathering</button>
=======
      <button type='button' onclick="deleteGathering('${
        gathering.id
      }')" id='delete-button'>Delete Gathering</button>
>>>>>>> ac2db8765fdd6a5d8c2ed8e5a609a61157e73402
    `

    const hoverWindow = new google.maps.InfoWindow({
      content: hoverHtml
    })

    marker.addListener("click", function() {
      hoverWindow.open(map, marker)
    })

<<<<<<< HEAD
    var button = document.getElementById("delete-button-${index}")

    button.addEventListener("click", function() {
      deleteGathering(gathering.id)
    })
=======
    // var button = document.getElementById(`delete-button-${index}`)
    //
    // button.addEventListener("click", function() {
    //   deleteGathering(gathering.id)
    // })
>>>>>>> ac2db8765fdd6a5d8c2ed8e5a609a61157e73402
    // bounds.extend(marker.position)
    // return element
  })
  // map.fitBounds(bounds)
  // map.setZoom(17)
  $(".gatherings").html(myGatheringsElement)
}

function displaySingleGathering(data) {
  const location = new google.maps.LatLng({
    lat: data.lat,
    lng: data.lng
  })
  var marker = new google.maps.Marker({
    map: map,
    position: location,
    label: "M"
  })
  map.setCenter(location)
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

function handleGatheringAdd(e, infoWindow) {
  console.log("preparing to add")
  e.preventDefault()
  const address = $("#map #address").val()
  const title = $("#map #title").val()
  const restaurant = $("#map #restaurant").val()
  const date = $("#map #date").val()
  const time = $("#map #time").val()

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
    $("#map #title").val("")
    $("#map #restaurant").val("")
    $("#map #address").val("")
    $("#map #date").val("")
    $("#map #time").val("")
    infoWindow.close(map)
  })
}

function deleteGathering(gatheringId) {
  console.log("Deleting gathering`" + gatheringId + "`")
  $.ajax({
    url: GATHERINGS_URL + "/" + gatheringId,
    method: "DELETE",
    // success: function(data){
    //   getAndDisplayGatherings()
    // }
    
    complete: function(data) {
      getAndDisplayGatherings()
    }
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

$(function() {
  setupAjax()
  //myGatherings()
})

// problems
//   drops multiple markers
//     differentiate between others gatherings and my gatherings
//   delete gathering button doesn't work
//   increment number attending
//   restaurant markers overlay gathering markers
//   unauthorization in testing
<<<<<<< HEAD

=======
>>>>>>> ac2db8765fdd6a5d8c2ed8e5a609a61157e73402
