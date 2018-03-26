const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {app, jwtAuth, runServer, closeServer} = require('../server');
const { User, Gathering } = require('../models');
const {DATABASE_URL, JWT_SECRET} = require('../config')

const expect = chai.expect;

chai.use(chaiHttp);

describe('Gathering', function() {
	before(function() {
		return runServer(DATABASE_URL);
	});

	// beforeEach(function(done) {
	// 	add
	// })

	after(function() {
		return closeServer();
	});
	describe('GET endpoint', function() {
		it('should return all existing gatherings', function() {
			let res;
			return chai.request(app)
				.get('/gatherings')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
				})

		});

		it('should return all my gatherings', function() {
			let res;
			return chai.request(app)
				.get('/gatherings/my')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
				})
		})

		it('should return all existing users', function() {
			let res;
			return chai.request(app)
				.get('/users')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
				})
		});
	});

	
	describe('POST endpoints', function() {
		it('should add a new gathering', function() {
			const newGathering = {title: 'mygathering', restaurant: 'mcdonalds', address: '3456 12th Ave NE'};

			return chai.request(app)
				.post('/gatherings')
				.send(newGathering)
				.then(function(res) {
					expect(res).to.have.status(201);
				});
		});

		it('should add a new user', function() {
			const newUser = {username: 'mcgill', password: 'doggo45'}

			return chai.request(app)
				.post('/users')
				.send(newUser)
				.then(function(res) {
					expect(res).to.have.status(201);
				});

		})
	})

	describe('PUT endpoint', function() {
		it('should update gatherings on PUT', function() {
			const updateData = {
				attending: 2
			};

			return Gathering
				.findOne()
				.then(function(gathering) {
					updateData.id = gathering.id;
					return chai.request(app)
						.put(`/gatherings/${gathering.id}`)
						.send(updateData);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
				});

		});
	})
	
	describe('DELETE endpoint', function() {
		it('should delete a gathering by id', function() {
			let gathering;

			return Gathering
				.findOne()
				.then(function(_gathering) {
					gathering = _gathering;
					return chai.request(app)
						.delete(`/gatherings/${gathering.id}`);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
				})
		})
	})

});