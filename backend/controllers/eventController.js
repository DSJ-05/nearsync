const Event = require("../models/Event");

// ===============================
// GET ALL EVENTS (HOME FEED)
// ===============================
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message
    });
  }
};

// ===============================
// CREATE NEW EVENT
// ===============================
exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      category: req.body.category,
      organizer: req.body.organizer,
      price: req.body.price,
      maxAttendees: req.body.maxAttendees,
      contact: req.body.contact,
      image: req.body.image,

      // ✅ USER IDENTITY
      createdBy: req.body.createdBy,                 // email
      createdByUsername: req.body.createdByUsername  // username
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({
      message: "Error creating event",
      error: error.message
    });
  }
};

// ===============================
// GET EVENTS CREATED BY LOGGED-IN USER (PROFILE PAGE)
// ===============================
// Example: GET /api/events/my?email=dhishaj123@gmail.com
exports.getMyEvents = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const events = await Event.find({
      createdBy: email
    }).sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user events",
      error: error.message
    });
  }
};

// ===============================
// DELETE EVENT BY ID
// ===============================
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete event",
      error: error.message
    });
  }
};

