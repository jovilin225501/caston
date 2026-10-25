import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import jwt from 'jsonwebtoken';

// @desc    Get all events with search, filter, sorting, and pagination
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      status,
      dateFilter,
      availableOnly,
      sort = 'date_asc',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Text / Keyword Search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { organizer: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Status Filter (defaults to Upcoming/Ongoing for public discovery unless specified)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Date Range Filter
    const now = new Date();
    if (dateFilter === 'upcoming') {
      query.date = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
    } else if (dateFilter === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (dateFilter === 'this_week') {
      const startOfWeek = new Date(now);
      const endOfWeek = new Date(now);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      query.date = { $gte: startOfWeek, $lte: endOfWeek };
    } else if (dateFilter === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // Available Only Filter ($expr to check registeredCount < capacity)
    if (availableOnly === 'true') {
      query.$expr = { $lt: ['$registeredCount', '$capacity'] };
    }

    // Sorting
    let sortOptions = { date: 1 }; // default: upcoming first
    if (sort === 'date_desc') {
      sortOptions = { date: -1 };
    } else if (sort === 'capacity_desc') {
      sortOptions = { capacity: -1 };
    } else if (sort === 'title_asc') {
      sortOptions = { title: 1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const totalEvents = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize)
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      count: events.length,
      total: totalEvents,
      page: pageNumber,
      pages: Math.ceil(totalEvents / pageSize) || 1,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID with registration status if user is authenticated
// @route   GET /api/events/:id
// @access  Public (Enhanced if Authenticated)
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    let isUserRegistered = false;
    let userRegistration = null;

    // Optional token inspection to check if requesting user is registered
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'campusconnect_default_dev_secret_key_123456';
        const decoded = jwt.verify(token, secret);
        if (decoded && decoded.id) {
          userRegistration = await Registration.findOne({
            event: event._id,
            user: decoded.id,
            status: 'Confirmed',
          });
          if (userRegistration) {
            isUserRegistered = true;
          }
        }
      } catch (tokenErr) {
        // Token invalid or expired - ignore gracefully for public view
      }
    }

    return res.status(200).json({
      success: true,
      event,
      isRegistered: isUserRegistered,
      registration: userRegistration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      organizer,
      capacity,
      image,
      tags,
      status,
    } = req.body;

    if (!title || !description || !date || !time || !location || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required event details (title, description, date, time, location, capacity).',
      });
    }

    const numericCapacity = parseInt(capacity, 10);
    if (isNaN(numericCapacity) || numericCapacity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be a positive number greater than 0.',
      });
    }

    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Technical',
      date: new Date(date),
      time: time.trim(),
      location: location.trim(),
      organizer: organizer ? organizer.trim() : 'Campus Activity Council',
      capacity: numericCapacity,
      registeredCount: 0,
      image: image || undefined,
      tags: processedTags,
      status: status || 'Upcoming',
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    const {
      title,
      description,
      category,
      date,
      time,
      location,
      organizer,
      capacity,
      image,
      tags,
      status,
    } = req.body;

    if (capacity !== undefined) {
      const numericCapacity = parseInt(capacity, 10);
      if (isNaN(numericCapacity) || numericCapacity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Capacity must be a positive number.',
        });
      }
      if (numericCapacity < event.registeredCount) {
        return res.status(400).json({
          success: false,
          message: `Cannot decrease capacity to ${numericCapacity} because ${event.registeredCount} students are already registered.`,
        });
      }
      event.capacity = numericCapacity;
    }

    if (title) event.title = title.trim();
    if (description) event.description = description.trim();
    if (category) event.category = category;
    if (date) event.date = new Date(date);
    if (time) event.time = time.trim();
    if (location) event.location = location.trim();
    if (organizer) event.organizer = organizer.trim();
    if (image !== undefined) event.image = image;
    if (status) event.status = status;

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        event.tags = tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        event.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const updatedEvent = await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event and cleanup registrations
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Cascade delete all registrations for this event
    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
