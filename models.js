
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
	password: {type: String, required: true},
	username: {type: String, required: true, unique: true},
	firstName: {type: String, dafaul: ''},
	lastName: {type: String, default: ''}

});

const gatheringSchema = mongoose.Schema({
	title: {type: String, required: true},
	attending: {type: Number, default: 0},
	restaurant: {type: String, required: true},
	address: {type: String, required: true}
	// date: {type: Date},
	// time: {type: Date}
});

// const attendeeSchema = mongoose.Schema({
// 	host: {type: Boolean},
// 	gatheringId: { type: String},
// 	userId: { type: String}
// })

// attendeeSchema.methods.serialize = function() {
// 	return {
// 		host: this.
// 		gatheringId: Gathering.findById(this.gatheringId).exec().serialize(),
// 		userId: Gathering.findById(this.userId) 
// 	}
// }

userSchema.methods.serialize = function() {
	return {
		//password: this.password,
		id: this._id,
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName
		// gatherings: this.gatherings.map(gId => {
			
		// })
	}
}

gatheringSchema.methods.serialize = function() {

	return {
		id: this._id,
		title: this.title,
		attending: this.attending,
		restaurant: this.restaurant,
		address: this.address
		// date: this.date,
		// time: this.time
	};
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 8);
};


const Gathering = mongoose.model('Gathering', gatheringSchema);
const User = mongoose.model('User', userSchema);

module.exports = {Gathering, User};