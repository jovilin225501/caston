import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Calendar,
  Users,
  Trophy,
  Compass,
  ArrowRight,
  Code,
  Palette,
  Activity,
  Briefcase,
  HeartHandshake,
  BookOpen,
  CheckCircle,
  Shield,
  Zap,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { EventCard } from '../components/EventCard';
import { EventGridSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';

export const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await eventService.getEvents({ limit: 6, sort: 'date_asc' });
        setFeaturedEvents(res.events || []);
      } catch (err) {
        console.error('Failed to load featured events:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const categories = [
    {
      name: 'Technical',
      icon: Code,
      color: 'from-blue-500 to-indigo-600',
      description: 'Hackathons, coding sprints, AI masterclasses, and robotics expos.',
    },
    {
      name: 'Cultural',
      icon: Palette,
      color: 'from-purple-500 to-pink-600',
      description: 'Music concerts, dance showcases, theater drama, and art galas.',
    },
    {
      name: 'Sports',
      icon: Activity,
      color: 'from-emerald-500 to-teal-600',
      description: 'Inter-department leagues, futsal, basketball, and athletic meets.',
    },
    {
      name: 'Workshop',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
      description: 'Professional skill bootcamps, resume clinics, and tech talks.',
    },
    {
      name: 'Career',
      icon: Briefcase,
      color: 'from-cyan-500 to-blue-600',
      description: 'Campus placement drives, alumni mentorship, and startup pitches.',
    },
    {
      name: 'Social',
      icon: HeartHandshake,
      color: 'from-rose-500 to-red-600',
      description: 'Community volunteering, charity cleanups, and campus mixers.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-bold shadow-xs mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Discover What’s Happening Across Campus</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Find Your Community. <br className="hidden sm:inline" />
            <span className="gradient-text">Lead Campus Life.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one hub for university students. Discover hackathons, cultural festivals, sports tourneys, and student club workshops with instant RSVP and digital passes.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-brand-500/10 border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search events by title, club, or keyword (e.g. AI Hackathon)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Categories Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-700">Trending Now:</span>
            {['Technical', 'Cultural', 'Sports', 'Workshop'].map((cat) => (
              <Link
                key={cat}
                to={`/events?category=${cat}`}
                className="px-3 py-1 rounded-full bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-2xs hover:border-brand-300 transition-all"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-600">5,400+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500">Active Students</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">120+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500">Student Clubs</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-accent-600">350+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500">Annual Events</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">99.4%</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500">RSVP Reliability</div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Campus Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 hover:gap-3 transition-all"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <EventGridSkeleton count={3} />
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No events scheduled yet"
            description="Our clubs are preparing exciting upcoming campus events. Check back soon!"
            actionLabel="Discover All Categories"
            actionLink="/events"
          />
        )}
      </section>

      {/* Explore by Category Section */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
              Diverse Campus Life
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Browse By Category
            </h2>
            <p className="text-slate-600 text-sm">
              Whether you are an aspiring software engineer, fine artist, athlete, or volunteer, find events designed for your passions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/events?category=${cat.name}`}
                  className="group bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover-card flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why CampusConnect Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-300 text-xs font-bold mb-4 backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>Built for High College Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              A Complete Platform for Campus Leadership & Engagement
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Engineered with full-stack MERN architecture, CampusConnect eliminates chaotic paper signups and spreadsheet mismanagement with real-time seat reservations, atomic concurrency safety, and official digital passes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200">
                  Race-condition safe capacity validation
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200">
                  Instant printable & mobile digital event passes
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200">
                  Centralized student registration dashboard
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200">
                  Admin metrics & attendee management control
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 font-bold text-sm text-white shadow-lg shadow-brand-500/30 transition-all"
              >
                Create Student Account
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm text-white transition-all backdrop-blur-xs"
              >
                Learn Architecture
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
