import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrationService } from '../services/registrationService';
import { authService } from '../services/authService';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Trash2,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  AlertCircle,
  ExternalLink,
  Edit3,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { TicketModal } from '../components/TicketModal';
import { EmptyState } from '../components/EmptyState';
import toast from 'react-hot-toast';

export const StudentDashboardPage = () => {
  const { user, updateUser } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past' | 'all'
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    department: user?.department || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await registrationService.getMyRegistrations();
      setRegistrations(res.registrations || []);
    } catch (err) {
      console.error('Failed to fetch registrations:', err.message);
      toast.error('Unable to load your registered events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${title}"?`)) {
      return;
    }

    try {
      await registrationService.cancelRegistration(eventId);
      toast.success('Registration cancelled successfully.');
      // Remove from list
      setRegistrations((prev) => prev.filter((r) => r.event?._id !== eventId));
    } catch (err) {
      toast.error(err.message || 'Failed to cancel registration');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      const res = await authService.updateProfile(profileForm);
      updateUser(res.user);
      setIsEditingProfile(false);
      toast.success('Profile details updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Filter registrations by upcoming / past
  const now = new Date();
  const upcomingRegistrations = registrations.filter(
    (r) => r.event && new Date(r.event.date) >= now
  );
  const pastRegistrations = registrations.filter(
    (r) => r.event && new Date(r.event.date) < now
  );

  const displayedRegistrations =
    activeTab === 'upcoming'
      ? upcomingRegistrations
      : activeTab === 'past'
      ? pastRegistrations
      : registrations;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Student Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {user?.studentId ? `ID: ${user.studentId} • ` : ''}
              {user?.department || 'Department of General Studies'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            {isEditingProfile ? 'Close Editor' : 'Edit Profile'}
          </button>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Browse New Events
          </Link>
        </div>
      </div>

      {/* Profile Edit Drawer (if open) */}
      {isEditingProfile && (
        <form
          onSubmit={handleProfileSubmit}
          className="bg-brand-50/60 rounded-3xl p-6 border border-brand-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-brand-600" />
              Update Student Profile
            </h3>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={profileForm.studentId}
                onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              About Me / Bio
            </label>
            <textarea
              rows={2}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Tell other students about your campus interests..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 disabled:opacity-50"
            >
              {profileSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Events Joined
          </p>
          <p className="text-2xl font-extrabold text-slate-900">{registrations.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Upcoming Scheduled
          </p>
          <p className="text-2xl font-extrabold text-brand-600">
            {upcomingRegistrations.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed Activities
          </p>
          <p className="text-2xl font-extrabold text-emerald-600">
            {pastRegistrations.length}
          </p>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming ({upcomingRegistrations.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'past'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Past Activities ({pastRegistrations.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All History ({registrations.length})
        </button>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : displayedRegistrations.length > 0 ? (
        <div className="space-y-4">
          {displayedRegistrations.map((reg) => {
            const event = reg.event;
            if (!event) return null;

            const isPast = new Date(event.date) < now;
            const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={reg._id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Event Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=400&q=80'}
                    alt={event.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100 hidden sm:block"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {event.category}
                      </span>
                      {isPast ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Confirmed RSVP
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                    >
                      {event.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-brand-600" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ticket Pass Button and Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedRegistration({ ...reg, user });
                      setShowTicketModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors border border-brand-200"
                  >
                    <QrCode className="w-3.5 h-3.5 text-brand-600" />
                    Digital Pass
                  </button>

                  <Link
                    to={`/events/${event._id}`}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="View Event Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {!isPast && (
                    <button
                      onClick={() => handleCancelRegistration(event._id, event.title)}
                      className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Cancel RSVP"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={
            activeTab === 'upcoming'
              ? 'No upcoming event registrations'
              : 'No past activity history'
          }
          description="Discover hackathons, guest seminars, arts galas, and tournaments to get involved."
          actionLabel="Find Campus Events"
          actionLink="/events"
        />
      )}

      {/* Ticket Pass Modal */}
      {showTicketModal && selectedRegistration && (
        <TicketModal
          registration={selectedRegistration}
          isOpen={showTicketModal}
          onClose={() => {
            setShowTicketModal(false);
            setSelectedRegistration(null);
          }}
        />
      )}
    </div>
  );
};
