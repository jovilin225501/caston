import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import User from '../models/User.js';
import ContactMessage from '../models/ContactMessage.js';

// @desc    Get dashboard metrics and analytics for admins
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() },
      status: 'Upcoming',
    });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRegistrations = await Registration.countDocuments({ status: 'Confirmed' });
    const totalContactMessages = await ContactMessage.countDocuments({ status: 'New' });

    // Category distribution
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    // Total capacity and filled seats across all events
    const capacityAggregation = await Event.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          totalFilledSeats: { $sum: '$registeredCount' },
        },
      },
    ]);

    const totalCapacity = capacityAggregation[0]?.totalCapacity || 0;
    const totalFilledSeats = capacityAggregation[0]?.totalFilledSeats || 0;
    const capacityUtilization =
      totalCapacity > 0 ? Math.round((totalFilledSeats / totalCapacity) * 100) : 0;

    // Recent 5 registrations
    const recentRegistrations = await Registration.find({ status: 'Confirmed' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email studentId')
      .populate('event', 'title date location');

    return res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        upcomingEvents,
        totalStudents,
        totalRegistrations,
        totalContactMessages,
        totalCapacity,
        totalFilledSeats,
        capacityUtilization,
        categoryStats,
        recentRegistrations,
      },
    });
  } catch (error) {
    next(error);
  }
};
