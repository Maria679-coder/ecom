// models/Driver.js
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  licence_num: {
    type: String,
    required: true,
    unique: true,
  },
  phone_num: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  employStatus: {
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'active',
    // The enum keyword is used to restrict a value to a fixed set of values. It must be an array with at least one element, where each element is unique. The following is an example for validating street light colors: schema. { "enum": ["red", "amber", "green"]}
  },
  hiredate: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  additionalNotes: {
    type: String,
    required: false,
  },
  accidents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accident"
  }],
});

module.exports = mongoose.model('Driver', driverSchema);
