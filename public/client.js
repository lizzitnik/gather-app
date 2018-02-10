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

// const userTemplate = (
// 	'<div class="user">' +
// 		'<h2 class="user-full-name"></h2>' +
// 		'<h3 class="username"></h3>' +
// 		 '<div class="user-controls">' +
// 			'<button class="user-update">' +
// 				'<span class="join-label">update</span>' +
// 			'</button>' +
// 			'<button class="user-delete">' +
// 				'<span class="delete-label">delete</span>' +
// 			'</button>' +
// 		'</div>' +
// 	'</div>'
// 	)




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
	console.log('Adding gathering: ' + gathering);
	$.ajax({
		method: 'POST',
		url: GATHERINGS_URL,
		data: JSON.stringify(gathering),
		success: function(data) {
			getAndDisplayGatherings();
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

// function addUser(user) {
// 	console.log('Adding user: ' + user);
// 	$.ajax({
// 		method: 'POST',
// 		url: USER_URL,
// 		data: JSON.stringify(user),
// 		success: function(data) {
// 			getAndDisplayUsers();
// 		},
// 		dataType: 'json',
// 		contentType: 'application/json'
// 	});
// }

function deleteGathering(gatheringId) {
	console.log('Deleting gathering`' + gatheringId + '`');
	$.ajax({
		url: GATHERINGS_URL + '/' + gatheringId,
		method: 'DELETE',
		success: getAndDisplayGatherings
	});
}

// function deleteUser(userId) {
// 	console.log('Deleting user`' + userId + '`');
// 	$.ajax({
// 		url: USER_URL + '/' + userId,
// 		method: 'DELETE',
// 		success: getAndDisplayUsers
// 	});
// }

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

// function updateUser(user) {
// 	console.log('Updating user`' + user.id + '`');
// 	$.ajax({
// 	    url: USER_URL + '/' + user.id,
// 	    method: 'PUT',
// 	    data: user,
// 	    success: function(data) {
// 	      getAndDisplayUsers();
//     	}
//   	});
// }

function handleGatheringAdd() {
	console.log('preparing to add');
	$('.create-form').submit(function(e) {
		console.log('adding');
		e.preventDefault();
		addGathering({
			title: $(this).find('#title').val(),
			restaurant: $(this).find('#restaurant').val(),
			address: $(this).find('#address').val()
			// date: $(this).find('#date').val(),
			// time: $(this).find('#time').val()
	
		});
		$('#title').val('');
		$('#restaurant').val('');
		$('#address').val('');
	});
}

// function handleUserAdd() {
// 	console.log('preparing to add');
// 	$('.signup-form').submit(function(e) {
// 		console.log('adding');
// 		e.preventDefault();
// 		addUser({
// 			name: $(this).find('#full-name').val(),
// 			userName: $(this).find('#user').val(),
// 			password: $(this).find('#pass').val(),
// 			email: $(this).find('#email').val(),
// 		});
// 	});
// }

function handleGatheringDelete() {
	$('.gatherings').on('click', '.gathering-delete', function(e) {
		e.preventDefault();
		deleteGathering(
			$(this).closest('.gathering').attr('id'));
	});
}

// function handleUserDelete() {
// 	$('.gatherings').on('click', '.gathering-delete', function(e) {
// 		e.preventDefault();
// 		deleteGathering(
// 			$(this).closest('.gathering').attr('id'));
// 	});
// }

function handleNumberAttending() {
	$('.gatherings').on('click', '.gathering-join', function(e) {
		e.preventDefault();
		let element = $(this).closest('.gathering');

		let item = {
			id: element.attr('id'),
			attending: (parseInt(element.find('.number-attending').text()))++
		}
		updateGathering(item);	
	});
}

$(function() {
	getAndDisplayGatherings();
	handleGatheringAdd();
	handleGatheringDelete();

})

