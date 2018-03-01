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

function getAndDisplayGatherings(data) {
  console.log("retrieving gatherings")

  $.getJSON(GATHERINGS_URL, displayGatherings)
}

function getAndDisplayUsers() {
  console.log('retrieving users')
}


function deleteUser(userId) {
  console.log("Deleting user`" + userId + "`")
  $.ajax({
    url: USER_URL + "/" + userId,
    method: "DELETE",
    success: getAndDisplayUsers
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
  window.location.href = "/map.html"
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

function addUser(user) {
  const creds = {
    username: user.username,
    password: user.password
  }

  console.log("Adding user: ", user)
  $.ajax({
    method: "POST",
    url: USER_URL,
    data: JSON.stringify(user),
    success: function(data) {
      login(creds)
      getAndDisplayUsers()
    },
    error: function(data) {
      console.log(data)
    }
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

    // $('.login-wrap').hide();
    // $('.map-conatiner').show();

    // $('.first-name').val('');
    // $('.last-name').val('');
    // $('.user').val('');
    // $('.pass').val('');
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
  handleGatheringAdd()
  handleGatheringDelete()
  handleUserAdd()
  handleLogin()
  myGatherings()
})
