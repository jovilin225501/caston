import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [150, 'Event title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify an event category'],
      enum: [
        'Technical',
        'Cultural',
        'Sports',
        'Workshop',
        'Social',
        'Career',
        'Academic',
        'Other',
      ],
      default: 'Technical',
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide event time (e.g., 10:00 AM - 1:00 PM)'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a venue or location'],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Please provide the organizer or club name'],
      trim: true,
      default: 'Campus Activity Council',
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide maximum attendee capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: [0, 'Registered count cannot be negative'],
    },
    image: {
      type: String,
      trim: true,
      default:
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field to compute seats available
eventSchema.virtual('seatsLeft').get(function () {
  return Math.max(0, this.capacity - (this.registeredCount || 0));
});

// Indexes for fast searching and filtering
eventSchema.index({ title: 'text', description: 'text', location: 'text', organizer: 'text' });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
