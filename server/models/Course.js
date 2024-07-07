const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  deliveryMode: {
    type: String,
    enum: ['in-person', 'remote', 'hybrid'],
    required: true,
  },
  schedule: {
    type: String,
    enum: ['full-time', 'part-time'],
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
