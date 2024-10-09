const mongoose = require('mongoose');

const accidentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  numb_num: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  damage: {
    type: String,
    required: true
  },
  injuries: {
    type: String,
    required: true
  },
  expense: {
    type: Number,
    required: true
  },
  driver: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver"
  }],
}, { timestamps: true });

// Timestamps save the current time of the document created and also when it was updated in form of a Date by turning it true.

const accidentModel = mongoose.model('Accident', accidentSchema);

module.exports = accidentModel;
