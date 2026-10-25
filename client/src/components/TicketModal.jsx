import React from 'react';
import { X, Printer, Calendar, Clock, MapPin, User, CheckCircle2, QrCode } from 'lucide-react';

export const TicketModal = ({ registration, isOpen, onClose }) => {
  if (!isOpen || !registration) return null;

  const event = registration.event || {};
  const user = registration.user || {};

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBA';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
              Official Campus Pass
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified RSVP
            </span>
          </div>
          <h2 className="text-xl font-extrabold leading-snug drop-shadow-xs">
            {event.title || 'Campus Activity'}
          </h2>
          <p className="text-xs text-brand-100 mt-1">
            Organized by {event.organizer || 'Campus Council'}
          </p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5">
          {/* Attendee Details */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-dashed border-slate-200">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Attendee Name
              </p>
              <p className="text-sm font-bold text-slate-900">{user.name || 'Student'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Student ID / Dept
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {user.studentId || 'N/A'} • {user.department || 'General'}
              </p>
            </div>
          </div>

          {/* Event Schedule & Location */}
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="font-medium text-slate-800">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{event.time || 'Check schedule'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="font-medium text-slate-800">{event.location || 'Campus'}</span>
            </div>
          </div>

          {/* Ticket Code and Barcode Style */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Pass Code
              </p>
              <p className="text-base font-mono font-extrabold text-brand-700 tracking-wider">
                {registration.ticketCode || 'CC-REG-PASS'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Issued on {new Date(registration.registeredAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div className="w-16 h-16 bg-white p-1.5 rounded-xl border border-slate-200 flex items-center justify-center text-slate-800">
              <QrCode className="w-full h-full" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print / Save Pass
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
