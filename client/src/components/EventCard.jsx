import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const EventCard = ({ event, isRegistered = false }) => {
  const {
    _id,
    title,
    category,
    date,
    time,
    location,
    capacity,
    registeredCount = 0,
    image,
    status,
  } = event;

  const seatsLeft = Math.max(0, capacity - registeredCount);
  const percentFilled = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const isSoldOut = seatsLeft === 0;

  // Category badge colors
  const categoryColors = {
    Technical: 'bg-blue-100 text-blue-700 border-blue-200',
    Cultural: 'bg-purple-100 text-purple-700 border-purple-200',
    Sports: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Workshop: 'bg-amber-100 text-amber-700 border-amber-200',
    Career: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    Social: 'bg-rose-100 text-rose-700 border-rose-200',
    Academic: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Other: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover-card flex flex-col justify-between">
      <div>
        {/* Card Image and Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-md shadow-xs ${
                categoryColors[category] || categoryColors.Other
              }`}
            >
              {category}
            </span>
          </div>

          {/* Registered or Sold Out Status */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {isRegistered ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Registered
              </span>
            ) : isSoldOut ? (
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white shadow-xs">
                Sold Out
              </span>
            ) : (
              <span className="inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                {seatsLeft} seats left
              </span>
            )}
          </div>

          {/* Date Overlay */}
          <div className="absolute bottom-3 left-3 text-white">
            <span className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-brand-300" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3.5">
          <Link to={`/events/${_id}`} className="block focus:outline-hidden">
            <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Meta Details */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 truncate">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {registeredCount} / {capacity} Registered
              </span>
              <span className="font-semibold text-slate-700">{percentFilled}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentFilled >= 100
                    ? 'bg-rose-500'
                    : percentFilled > 75
                    ? 'bg-amber-500'
                    : 'bg-brand-500'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="p-5 pt-0">
        <Link
          to={`/events/${_id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-600 hover:text-white transition-all duration-200 group/btn"
        >
          <span>View Details & RSVP</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
