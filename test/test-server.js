const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Gatherings', function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('should list gatherings on GET', function() {
		return chai.request(app)
			.get('/gatherings')
			.then(function(res) {
				expect(res).to.have.status(200);
		});
	});
});