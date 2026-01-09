const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    // =====================
    // BASIC EVENT DETAILS
    // =====================
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    time: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        'music',
        'sports',
        'tech',
        'food',
        'arts',
        'education',
        'school',
        'college',
        'social',
        'other'
      ]
    },

    // =====================
    // USER IDENTITY
    // =====================

    // Email of logged-in user
    createdBy: {
      type: String,
      required: true
    },

    // Username shown publicly (Instagram-style)
    username: {
      type: String,
      required: true
    },

    // Organizer name (club / college / person)
    organizer: {
      type: String,
      required: true
    },

    // =====================
    // OPTIONAL DETAILS
    // =====================
    price: {
      type: Number,
      default: 0
    },

    maxAttendees: {
      type: Number,
      default: null
    },

    contact: {
      type: String
    },

    image: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', eventSchema);
