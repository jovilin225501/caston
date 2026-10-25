import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  Tag,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Share2,
  Trash2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import { TicketModal } from '../components/TicketModal';
import toast from 'react-hot-toast';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const res = await eventService.getEventById(id);
      setEvent(res.event);
      setIsRegistered(res.isRegistered);
      setUserRegistration(res.registration);
    } catch (err) {
      console.error('Failed to load event:', err.message);
      toast.error(err.message || 'Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id, isAuthenticated]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to register for campus events.');
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    try {
      setActionLoading(true);
      const res = await registrationService.registerForEvent(id, notes);
      toast.success(res.message || 'Successfully registered for event!');
      setIsRegistered(true);
      setUserRegistration(res.registration);
      // update event state with incremented count
      setEvent((prev) => ({
        ...prev,
        registeredCount: prev.registeredCount + 1,
      }));
      setShowTicketModal(true);
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!window.confirm('Are you sure you want to cancel your RSVP for this event? Your seat will be made available to other students.')) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await registrationService.cancelRegistration(id);
      toast.success(res.message || 'Registration cancelled.');
      setIsRegistered(false);
      setUserRegistration(null);
      setEvent((prev) => ({
        ...prev,
        registeredCount: Math.max(0, prev.registeredCount - 1),
      }));
    } catch (err) {
      toast.error(err.message || 'Failed to cancel registration');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out ${event?.title} on CampusConnect!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-3" />
        <p className="text-slate-500 font-medium">Loading event details...</p>
      </div>
    );
  }

  if (!event) return null;

  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isSoldOut = seatsLeft === 0;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button and Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to events</span>
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share Event
        </button>
      </div>

      {/* Main Banner Image */}
      <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-600 text-white shadow-xs">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
              Organized by {event.organizer}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Details Grid & Registration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event Description, Tags & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">About This Campus Event</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Event Highlights & Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Event Schedule & Venue Details Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
              <Calendar className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Date & Day</p>
                <p className="text-sm font-bold text-slate-900">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
              <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Time Schedule</p>
                <p className="text-sm font-bold text-slate-900">{event.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 sm:col-span-2">
              <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Venue & Location</p>
                <p className="text-sm font-bold text-slate-900">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: RSVP Action Box */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg shadow-brand-500/5 space-y-6 sticky top-24">
            {/* Capacity Meter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-600" />
                  Seat Availability
                </span>
                <span className={seatsLeft <= 5 && !isSoldOut ? 'text-amber-600 font-extrabold' : 'text-slate-800'}>
                  {isSoldOut ? '0 Seats Left' : `${seatsLeft} of ${event.capacity} Available`}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentFilled >= 100
                      ? 'bg-rose-500'
                      : percentFilled > 75
                      ? 'bg-amber-500'
                      : 'bg-brand-600'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-right">
                {event.registeredCount} students confirmed
              </p>
            </div>

            {/* Registration Actions */}
            {isRegistered ? (
              <div className="space-y-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  You are registered for this event!
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Your seat is reserved. You can view your pass code or print your official campus ticket below.
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-sm transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    View / Print Digital Pass
                  </button>
                  <button
                    onClick={handleCancelRegistration}
                    disabled={actionLoading}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Cancel My Registration
                  </button>
                </div>
              </div>
            ) : isSoldOut ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-rose-800 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  Maximum Capacity Reached
                </div>
                <p className="text-xs text-rose-600">
                  All {event.capacity} seats have been reserved by students. Check back if seats open due to cancellations.
                </p>
              </div>
            ) : isAuthenticated ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Registration Notes / Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g., Team name, dietary needs, or laptop setup..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Seat...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Instant RSVP (Confirm Seat)</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-xs text-slate-600">
                  Sign in with your student credentials to reserve your seat instantly.
                </p>
                <Link
                  to="/login"
                  state={{ from: { pathname: `/events/${id}` } }}
                  className="block w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors shadow-xs"
                >
                  Log In to Register
                </Link>
                <Link
                  to="/register"
                  className="block text-xs font-semibold text-brand-600 hover:underline"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            )}

            {/* Admin Shortcuts */}
            {isAdmin && (
              <div className="pt-4 border-t border-slate-200 text-center">
                <Link
                  to={`/admin`}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Manage Attendees in Admin Desk
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <TicketModal
          registration={
            userRegistration || {
              event,
              user,
              ticketCode: 'CC-CONFIRMED-PASS',
              registeredAt: new Date(),
            }
          }
          isOpen={showTicketModal}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
};
