import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  Calendar,
  Users,
  Edit2,
  Trash2,
  Eye,
  Layers,
  Inbox,
  Clock,
  MapPin,
  X,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Printer,
  Search,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { contactService, adminService } from '../services/contactService';
import { EmptyState } from '../components/EmptyState';
import toast from 'react-hot-toast';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'messages'

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formSaving, setFormSaving] = useState(false);

  // Attendees Roster Modal State
  const [rosterEvent, setRosterEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');

  // Event Form State
  const initialForm = {
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    time: '10:00 AM - 01:00 PM',
    location: '',
    organizer: 'Campus Activity Council',
    capacity: 50,
    image: '',
    tags: '',
    status: 'Upcoming',
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, eventsRes, msgRes] = await Promise.all([
        adminService.getStats().catch(() => ({ stats: null })),
        eventService.getEvents({ limit: 50, sort: 'newest' }),
        contactService.getMessages().catch(() => ({ messages: [] })),
      ]);

      setStats(statsRes.stats);
      setEvents(eventsRes.events || []);
      setContactMessages(msgRes.messages || []);
    } catch (err) {
      console.error('Failed to load admin data:', err.message);
      toast.error('Failed to retrieve coordinator records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingEventId(null);
    setFormData(initialForm);
    setIsEventModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEventId(evt._id);
    setFormData({
      title: evt.title || '',
      description: evt.description || '',
      category: evt.category || 'Technical',
      date: evt.date ? new Date(evt.date).toISOString().split('T')[0] : '',
      time: evt.time || '',
      location: evt.location || '',
      organizer: evt.organizer || '',
      capacity: evt.capacity || 50,
      image: evt.image || '',
      tags: Array.isArray(evt.tags) ? evt.tags.join(', ') : '',
      status: evt.status || 'Upcoming',
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.capacity) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      setFormSaving(true);
      if (editingEventId) {
        await eventService.updateEvent(editingEventId, formData);
        toast.success('Event updated successfully!');
      } else {
        await eventService.createEvent(formData);
        toast.success('New campus event published successfully!');
      }
      setIsEventModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Error saving event.');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}" and all its student registrations?`)) {
      return;
    }

    try {
      await eventService.deleteEvent(id);
      toast.success('Event removed from catalog.');
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete event');
    }
  };

  const handleOpenRoster = async (evt) => {
    try {
      setRosterEvent(evt);
      setAttendeesLoading(true);
      const res = await registrationService.getEventRegistrations(evt._id);
      setAttendees(res.registrations || []);
    } catch (err) {
      toast.error('Could not fetch registered attendees list');
    } finally {
      setAttendeesLoading(false);
    }
  };

  const filteredAttendees = attendees.filter((a) => {
    const term = rosterSearch.toLowerCase();
    const uName = a.user?.name?.toLowerCase() || '';
    const uEmail = a.user?.email?.toLowerCase() || '';
    const uId = a.user?.studentId?.toLowerCase() || '';
    const tCode = a.ticketCode?.toLowerCase() || '';
    return uName.includes(term) || uEmail.includes(term) || uId.includes(term) || tCode.includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Coordinator Control Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Activity & Event Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish events, monitor real-time seat capacities, and inspect registered attendee rosters.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/30 transition-all shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Metrics Banner */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Events
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.totalEvents}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total RSVPs
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-600">
              {stats.totalRegistrations}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Students
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
              {stats.totalStudents}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Capacity Utilization
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {stats.capacityUtilization}%
            </p>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'events'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Manage Events ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'messages'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Student Inquiries ({contactMessages.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : activeTab === 'events' ? (
        /* Events Table */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4">Capacity & RSVPs</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => {
                  const percent = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
                  return (
                    <tr key={evt._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm max-w-[200px] sm:max-w-xs truncate">
                              {evt.title}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{evt.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{evt.category}</td>
                      <td className="py-3 px-4 text-slate-600">
                        <p className="font-medium text-slate-800">
                          {new Date(evt.date).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-slate-400">{evt.time}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold">
                            <span>{evt.registeredCount} / {evt.capacity}</span>
                            <span className="text-slate-500">{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percent >= 100 ? 'bg-rose-500' : 'bg-brand-600'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenRoster(evt)}
                            title="View Attendee List"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(evt)}
                            title="Edit Event"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt._id, evt.title)}
                            title="Delete Event"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Student Messages Table */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Student & Club Inquiries</h2>
          {contactMessages.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {contactMessages.map((msg) => (
                <div key={msg._id} className="py-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{msg.subject}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    From: <span className="text-slate-900 font-bold">{msg.name}</span> ({msg.email})
                  </p>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl mt-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No messages yet"
              description="Student contact submissions and inquiries will show up here."
            />
          )}
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingEventId ? 'Edit Event Details' : 'Publish New Campus Event'}
              </h2>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus HackAI 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {['Technical', 'Cultural', 'Sports', 'Workshop', 'Career', 'Social', 'Academic'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organizer Club / Council *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IEEE Student Chapter"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Schedule *</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM - 1:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity (Seats) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Venue / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Amphitheatre or Innovation Lab 301"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed description of the activity, rules, speaker lineup, and instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="AI, Hackathon, Coding, Prizes"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xs disabled:opacity-50"
                >
                  {formSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registered Attendees Roster Modal */}
      {rosterEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Attendee Roster: {rosterEvent.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Total Confirmed RSVPs: {attendees.length} / {rosterEvent.capacity}
                </p>
              </div>
              <button
                onClick={() => setRosterEvent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Attendee */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by student name, ID, or ticket code..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto space-y-2">
              {attendeesLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
                </div>
              ) : filteredAttendees.length > 0 ? (
                filteredAttendees.map((att) => (
                  <div
                    key={att._id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{att.user?.name || 'Student'}</p>
                      <p className="text-slate-500 text-[11px]">
                        {att.user?.studentId ? `${att.user.studentId} • ` : ''}
                        {att.user?.department || 'General'}
                      </p>
                      <p className="text-[10px] text-slate-400">{att.user?.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                        {att.ticketCode}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(att.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-400">
                  No registered attendees match this query.
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Attendance Sheet
              </button>
              <button
                onClick={() => setRosterEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
