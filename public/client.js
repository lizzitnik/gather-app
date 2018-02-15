'use strict'


const gatheringTemplate = (
	'<div class="gathering">' +
		'<h2 class="gathering-title"></h2>' +
		'<h3 class="gathering-restaurant"></h3>' +
		'<h3 class="gathering-address"></h3>' +
		'<p>Number Attending: <span class="number-attending"></span></p>' +
		// '<h3 class="gathering-date"></h3>' +
		// '<h3 class="gathering-time"></h3>' +
		 '<div class="gathering-controls">' +
			'<button class="gathering-join">' +
				'<span class="join-label">join</span>' +
			'</button>' +
			'<button class="gathering-delete">' +
				'<span class="delete-label">delete</span>' +
			'</button>' +
		'</div>' +
		'<hr>' +
	'</div>'			
);


const serverBase = '//localhost:8080/';
const USER_URL = serverBase + 'users';
const GATHERINGS_URL = serverBase + 'gatherings';


function getAndDisplayGatherings() {
	console.log('retrieving gatherings');
	
	$.getJSON(GATHERINGS_URL, function(data) {
		const gatheringsElement = data.gatherings.map(function(gathering) {
			let element = $(gatheringTemplate);
			element.attr('id', gathering.id);
			element.find('.gathering-title').text(gathering.title);
			element.find('.number-attending').text(gathering.attending);
			element.find('.gathering-restaurant').text(gathering.restaurant);
			element.find('.gathering-address').text(gathering.address);
			// element.find('.gathering-date').text(gathering.date);
			// element.find('.gathering-time').text(gathering.time);

			return element;
		});
		$('.gatherings').html(gatheringsElement)
	});
}

function addGathering(gathering) {
	console.log('Adding gathering: ' + gathering);
	$.ajax({
		method: 'POST',
		url: GATHERINGS_URL,
		data: JSON.stringify(gathering),
		success: function(data) {
			getAndDisplayGatherings();
		},
		headers: {
			TOKEN: localStorage.getItem("TOKEN")
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}


function deleteGathering(gatheringId) {
	console.log('Deleting gathering`' + gatheringId + '`');
	$.ajax({
		url: GATHERINGS_URL + '/' + gatheringId,
		method: 'DELETE',
		success: getAndDisplayGatherings
	});
}


function updateGathering(gathering) {
	console.log('Updating gathering`' + gathering.id + '`');
	$.ajax({
	    url: GATHERINGS_URL + '/' + gathering.id,
	    method: 'PUT',
	    data: gathering,
	    success: function(data) {
	      getAndDisplayGatherings();
    	}
  	});
}

function handleGatheringAdd() {
	console.log('preparing to add');
	$('.create-form').submit(function(e) {
		console.log('adding');
		e.preventDefault();
		addGathering({
			title: $(this).find('#title').val(),
			restaurant: $(this).find('#restaurant').val(),
			address: $(this).find('#address').val(),
			date: $(this).find('#date').val(),
			time: $(this).find('#time').val()
	
		});
		$('#title').val('');
		$('#restaurant').val('');
		$('#address').val('');
		$('#date').val('');
		$('#time').val('');
	});
}

function handleGatheringDelete() {
	$('.gatherings').on('click', '.gathering-delete', function(e) {
		e.preventDefault();
		deleteGathering(
			$(this).closest('.gathering').attr('id'));
	});
}

// function handleNumberAttending() {
// 	$('.gatherings').on('click', '.gathering-join', function(e) {
// 		e.preventDefault();
// 		let element = $(this).closest('.gathering');

// 		let item = {
// 			id: element.attr('id'),
// 			attending: (parseInt(element.find('.number-attending').text()))++
// 		}
// 		updateGathering(item);	
// 	});
// }



// function getUSER() {
// 	$.ajax({
// 		url: "/auth/login",
// 		method: "POST",
// 		success: showUser,
// 		dataType: "json",
// 		contentType: "application/json"
// 	})
// }

function setupAjax() {
  $.ajaxSetup({
    dataType: "json",
    contentType: ""
  })
}

function addUser(user) {
	console.log('Adding user: ' + user);
	$.ajax({
		method: 'POST',
		url: USER_URL,
		data: JSON.stringify(user),
		success: function(data) {
			getAndDisplayUsers();
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function handleUserAdd() {
	console.log('preparing to add');
	$('.signup-form').submit(function(e) {
		console.log('adding');
		e.preventDefault();
		addUser({
			firstName: $(this).find('#first-name').val(),
			lastName: $(this).find('#last-name').val(),
			userName: $(this).find('#user').val(),
			password: $(this).find('#pass').val()
		});
	});
}

function login(userCreds) {
	$.ajax({
		url: "/auth/login",
		method: "POST",
		data: JSON.stringify(userCreds),
		success: addTokenToLocalStorage,
		dataType: "json",
		contentType: "application/json"
	})
}

function handleLogin() {
	$(".signin-form").submit(function(e) {
		e.preventDefault();

		login({
			userName: $(this)
				.find("#user")
				.val(),
			password: $(this)
				.find("#pass")
				.val()
		})
	})
}

function addTokenToLocalStorage() {
	localStorage.setItem("TOKEN", response.authToken);
	window.location.href = ""
}





















var map, places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = {'country': 'us'};
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

var countries = {
  'au': {
    center: {lat: -25.3, lng: 133.8},
    zoom: 4
  },
  'br': {
    center: {lat: -14.2, lng: -51.9},
    zoom: 3
  },
  'ca': {
    center: {lat: 62, lng: -110.0},
    zoom: 3
  },
  'fr': {
    center: {lat: 46.2, lng: 2.2},
    zoom: 5
  },
  'de': {
    center: {lat: 51.2, lng: 10.4},
    zoom: 5
  },
  'mx': {
    center: {lat: 23.6, lng: -102.5},
    zoom: 4
  },
  'nz': {
    center: {lat: -40.9, lng: 174.9},
    zoom: 5
  },
  'it': {
    center: {lat: 41.9, lng: 12.6},
    zoom: 5
  },
  'za': {
    center: {lat: -30.6, lng: 22.9},
    zoom: 5
  },
  'es': {
    center: {lat: 40.5, lng: -3.7},
    zoom: 5
  },
  'pt': {
    center: {lat: 39.4, lng: -8.2},
    zoom: 6
  },
  'us': {
    center: {lat: 37.1, lng: -95.7},
    zoom: 3
  },
  'uk': {
    center: {lat: 54.8, lng: -4.6},
    zoom: 5
  }
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: countries['us'].zoom,
    center: countries['us'].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  });
  console.log(map);

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

// Create the autocomplete object and associate it with the UI input control.
// Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */ (
          document.getElementById('autocomplete')), {
        types: ['(cities)'],
        componentRestrictions: countryRestrict
      });
  places = new google.maps.places.PlacesService(map);
  console.log(places);

  autocomplete.addListener('place_changed', onPlaceChanged);

  // Add a DOM event listener to react when the user selects a country.
  document.getElementById('country').addEventListener(
      'change', setAutocompleteCountry);
}

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    //setGatheringMarkers();
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }
}

// Search for hotels in the selected city, within the viewport of the map.
function search() {
  var search = {
    bounds: map.getBounds(),
    types: ['restaurants']
  };

  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();
      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });
        // If the user clicks a restaurant marker, show the details of that restaurant
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

// Set the country restriction based on user input.
// Also center and zoom the map on the given country.
function setAutocompleteCountry() {
  var country = document.getElementById('country').value;
  if (country == 'all') {
    autocomplete.setComponentRestrictions({'country': []});
    map.setCenter({lat: 15, lng: 0});
    map.setZoom(2);
  } else {
    autocomplete.setComponentRestrictions({'country': country});
    map.setCenter(countries[country].center);
    map.setZoom(countries[country].zoom);
  }
  clearResults();
  clearMarkers();
}

function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

function addResult(result, i) {
  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  var marker = this;
  places.getDetails({placeId: marker.placeResult.place_id},
      function(place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="restaurantIcon" ' +
      'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
      '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  // Assign a five-star rating to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
    document.getElementById('iw-rating-row').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
}




$(function() {
	getAndDisplayGatherings();
	handleGatheringAdd();
	handleGatheringDelete();

})

