import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Register student for an event (Race-condition safe atomic reservation)
// @route   POST /api/events/:id/register
// @access  Private (Students & Authenticated Users)
export const registerForEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    if (event.status === 'Cancelled' || event.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: `Registration is closed because this event is ${event.status.toLowerCase()}.`,
      });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      user: userId,
      status: 'Confirmed',
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event.',
        ticketCode: existingRegistration.ticketCode,
      });
    }

    // Atomic seat reservation to prevent race conditions on capacity
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lt: ['$registeredCount', '$capacity'] },
      },
      {
        $inc: { registeredCount: 1 },
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event has reached maximum capacity. No seats available.',
      });
    }

    // Create the registration record
    try {
      const registration = await Registration.create({
        event: eventId,
        user: userId,
        status: 'Confirmed',
        notes: req.body.notes || '',
      });

      // Populate event and user details for response
      await registration.populate([
        { path: 'event', select: 'title date time location image category' },
        { path: 'user', select: 'name email studentId department' },
      ]);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! See you at the event.',
        registration,
        seatsLeft: Math.max(0, updatedEvent.capacity - updatedEvent.registeredCount),
      });
    } catch (createErr) {
      // Rollback atomic counter increment if registration record creation fails
      await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });

      if (createErr.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'You have already registered for this event.',
        });
      }
      throw createErr;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel student registration for an event
// @route   DELETE /api/events/:id/register
// @access  Private
export const cancelRegistration = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Find active registration
    const registration = await Registration.findOne({
      event: eventId,
      user: userId,
      status: 'Confirmed',
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No active registration found for this event.',
      });
    }

    // Delete or update status to Cancelled
    await registration.deleteOne();

    // Atomically decrement registered count safely (never below 0)
    await Event.findOneAndUpdate(
      { _id: eventId, registeredCount: { $gt: 0 } },
      { $inc: { registeredCount: -1 } }
    );

    return res.status(200).json({
      success: true,
      message: 'Your registration has been cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations of current logged in student
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'event',
        select: 'title description category date time location capacity registeredCount image status organizer',
      });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all student registrations for a specific event
// @route   GET /api/events/:id/registrations
// @access  Private/Admin
export const getEventRegistrations = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    const registrations = await Registration.find({ event: eventId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email studentId department phone');

    return res.status(200).json({
      success: true,
      event: {
        _id: event._id,
        title: event.title,
        capacity: event.capacity,
        registeredCount: event.registeredCount,
      },
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};
