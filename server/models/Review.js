const mongoose = require('mongoose');

// Define a schema
const reviewSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',  // Reference to Course model
    required: true
  },
  curriculumRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  instructorRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  supportRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    required: true
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt fields automatically
});

// Create a model based on the schema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
