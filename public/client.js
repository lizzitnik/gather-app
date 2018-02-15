"use strict"

const gatheringTemplate =
  '<div class="gathering">' +
  '<h2 class="gathering-title"></h2>' +
  '<h3 class="gathering-restaurant"></h3>' +
  '<h3 class="gathering-address"></h3>' +
  '<p>Number Attending: <span class="number-attending"></span></p>' +
  '<h3 class="gathering-date"></h3>' +
  '<h3 class="gathering-time"></h3>' +
  '<div class="gathering-controls">' +
  '<button class="gathering-join">' +
  '<span class="join-label">join</span>' +
  "</button>" +
  '<button class="gathering-delete">' +
  '<span class="delete-label">delete</span>' +
  "</button>" +
  "</div>" +
  "<hr>" +
  "</div>"

const serverBase = "//localhost:8080/"
const USER_URL = serverBase + "users"
const GATHERINGS_URL = serverBase + "gatherings"

function getAndDisplayGatherings() {
  console.log("retrieving gatherings")

  $.getJSON(GATHERINGS_URL, function(data) {
    const gatheringsElement = data.gatherings.map(function(gathering) {
      let element = $(gatheringTemplate)
      element.attr("id", gathering.id)
      element.find(".gathering-title").text(gathering.title)
      element.find(".number-attending").text(gathering.attending)
      element.find(".gathering-restaurant").text(gathering.restaurant)
      element.find(".gathering-address").text(gathering.address)
      element.find(".gathering-date").text(gathering.date)
      element.find(".gathering-time").text(gathering.time)

      return element
    })
    $(".gatherings").html(gatheringsElement)
  })
}

// function getAndDisplayUsers() {
// 	console.log('retrieving users');

// 	$.getJSON(USER_URL, function(data) {
// 		const usersElement = data.users.map(function(user) {
// 			let element = $(userTemplate);
// 			element.attr('id', user.id);
// 			element.find('.user-full-name').text(user.name);
// 			element.find('.username').text(user.userName);
// 		})
// 	})
// }

function addGathering(gathering) {
  console.log("Adding gathering: " + gathering)
  $.ajax({
    method: "POST",
    url: GATHERINGS_URL,
    data: JSON.stringify(gathering),
    success: function(data) {
      getAndDisplayGatherings()
    }
  })
}

function addUser(user) {
  console.log("Adding user: ", user)
  $.ajax({
    method: "POST",
    url: USER_URL,
    data: JSON.stringify(user),
    success: function(data) {
      getAndDisplayUsers()
    }
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

function deleteUser(userId) {
  console.log("Deleting user`" + userId + "`")
  $.ajax({
    url: USER_URL + "/" + userId,
    method: "DELETE",
    success: getAndDisplayUsers
  })
}

function handleLogin() {
  console.log("preparing to add")
  $(".signin-form").submit(function(e) {
    console.log("adding")
    e.preventDefault()

    login({
      username: $(this)
        .find(".user")
        .val(),
      password: $(this)
        .find(".pass")
        .val()
    })
  })
}

function login(userCreds) {
  $.ajax({
    url: "/auth/login",
    method: "POST",
    data: JSON.stringify(userCreds),
    success: addTokenToLocalStorage
  })
}

function addTokenToLocalStorage(response) {
  localStorage.setItem("TOKEN", response.authToken)
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

function updateUser(user) {
  console.log("Updating user`" + user.id + "`")
  $.ajax({
    url: USER_URL + "/" + user.id,
    method: "PUT",
    data: user,
    success: function(data) {
      getAndDisplayUsers()
    }
  })
}

function handleGatheringAdd() {
  console.log("preparing to add")
  $(".create-form").submit(function(e) {
    console.log("adding")
    e.preventDefault()
    addGathering({
      title: $(this)
        .find("#title")
        .val(),
      restaurant: $(this)
        .find("#restaurant")
        .val(),
      address: $(this)
        .find("#address")
        .val(),
      date: $(this)
        .find("#date")
        .val(),
      time: $(this)
        .find("#time")
        .val()
    })
    $("#title").val("")
    $("#restaurant").val("")
    $("#address").val("")
    $("#date").val("")
    $("#time").val("")
  })
}

function handleUserAdd() {
  console.log("preparing to add")
  $(".signup-form").submit(function(e) {
    console.log("adding")
    e.preventDefault()
    addUser({
      firstName: $(this)
        .find(".first-name")
        .val(),
      lastName: $(this)
        .find(".last-name")
        .val(),
      username: $(this)
        .find(".user")
        .val(),
      password: $(this)
        .find(".pass")
        .val()
    })
  })
}

function handleGatheringDelete() {
  $(".gatherings").on("click", ".gathering-delete", function(e) {
    e.preventDefault()
    deleteGathering(
      $(this)
        .closest(".gathering")
        .attr("id")
    )
  })
}

// function geoLocationSuccess(pos) {
//   var crd = pos.coords;

//   var location = {lat: crd.latitude, lng: crd.longitude};

//   searcher(crd.latitude, crd.longitude);

// var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 8,
//         center: location
//  });

// var marker = new google.maps.Marker({
//         position: location,
//         map: map
//       });

// console.log('Your current position is:');
// console.log(`Latitude : ${crd.latitude}`);
// console.log(`Longitude: ${crd.longitude}`);
// console.log(`More or less ${crd.accuracy} meters.`);
//};

// function geoLocationError(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// };

// var options = {
//   enableHighAccuracy: true,
//   maximumAge: 0
// };

// navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError, options);

// function searcher(lat, long) {
//   var pyrmont = new google.maps.LatLng(lat, long);

//   map = new google.maps.Map(document.getElementById('map'), {
//       center: pyrmont,
//       zoom: 10
//     });

//   var request = {
//     location: pyrmont,
//     radius: '50000',
//     type: ['restaurant']
//   };

//   service = new google.maps.places.PlacesService(map);
//   service.nearbySearch(request, searcherSuccess);
// }

// function searcherSuccess(results, status) {
//   console.log(results);
//   if (status == google.maps.places.PlacesServiceStatus.OK) {
//     for (var i = 0; i < results.length; i++) {
//       var place = results[i];
//       createMarker(results[i]);

//     }
//   }
// }

// function createMarker(place) {
//         var placeLoc = place.geometry.location;
//         var marker = new google.maps.Marker({
//           map: map,
//           position: place.geometry.location
//         });

//         google.maps.event.addListener(marker, 'click', function() {
//           infowindow.setContent(place.name);
//           infowindow.open(map, this);
//         });
//       }

function handleNumberAttending() {
  $(".gatherings").on("click", ".gathering-join", function(e) {
    e.preventDefault()
    let element = $(this).closest(".gathering")

    let attending = parseInt(element.find(".number-attending").text()) + 1
    let item = {
      id: element.attr("id"),
      attending: attending
    }
    updateGathering(item)
  })
}

function setupAjax() {
  $.ajaxSetup({
    dataType: "json",
    contentType: "application/json",
    headers: {
      Authorization: "JWT " + localStorage.getItem("TOKEN")
    }
  })
}

$(function() {
  setupAjax()
  getAndDisplayGatherings()
  handleGatheringAdd()
  handleGatheringDelete()
  handleUserAdd()
  handleLogin()
})
