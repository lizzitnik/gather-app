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

function showLogin() {
  $(".enter-login").on("click", function(e) {
    e.preventDefault()

    $("header").hide()
    $("main").show()
  })
}

function getAndDisplayGatherings(data) {
  console.log("retrieving gatherings")

  $.getJSON(GATHERINGS_URL, function() {
    allGatherings()
  })
}

function getAndDisplayUsers() {
  console.log("retrieving users")
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

function handleNumberAttending(gathering, numAttending, marker) {
  let item = {
    id: gathering.id,
    attending: numAttending
  }
  updateGathering(item, marker)
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
  showLogin()
  setupAjax()
  handleUserAdd()
  handleLogin()
})
