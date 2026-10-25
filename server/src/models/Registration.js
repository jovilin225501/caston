import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ticketCode: {
      type: String,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active registrations for the same user and event
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

// Auto-generate a readable ticket code before saving if not present
registrationSchema.pre('save', function (next) {
  if (!this.ticketCode) {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampSuffix = Date.now().toString().slice(-4);
    this.ticketCode = `CC-${randomHex}-${timestampSuffix}`;
  }
  next();
});

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
