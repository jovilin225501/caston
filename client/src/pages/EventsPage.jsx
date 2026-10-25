import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Layers,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { EventCard } from '../components/EventCard';
import { EventGridSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Read filter params from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const dateFilter = searchParams.get('dateFilter') || 'all';
  const availableOnly = searchParams.get('availableOnly') === 'true';
  const sort = searchParams.get('sort') || 'date_asc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Local state for search input typing before submit
  const [searchInput, setSearchInput] = useState(search);

  // Fetch events whenever query params change
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {
          search: search || undefined,
          category: category !== 'All' ? category : undefined,
          dateFilter: dateFilter !== 'all' ? dateFilter : undefined,
          availableOnly: availableOnly ? 'true' : undefined,
          sort,
          page,
          limit: 9,
        };

        const res = await eventService.getEvents(params);
        setEvents(res.events || []);
        setTotalPages(res.pages || 1);
        setTotalCount(res.total || 0);
      } catch (err) {
        console.error('Error fetching events:', err.message);
        setError(err.message || 'Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, category, dateFilter, availableOnly, sort, page]);

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || val === 'All' || val === 'all' || val === false) {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });
    // Reset to page 1 whenever filters change unless page is explicitly updated
    if (!('page' in newParams)) {
      updated.delete('page');
    }
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const categories = [
    'All',
    'Technical',
    'Cultural',
    'Sports',
    'Workshop',
    'Career',
    'Social',
    'Academic',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Campus Activity Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Discover Campus Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, filter, and register for student activities and competitions ({totalCount} total events found).
          </p>
        </div>

        {/* Reset button if any filter active */}
        {(search || category !== 'All' || dateFilter !== 'all' || availableOnly || sort !== 'date_asc') && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        {/* Search Input and Sort Selection */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, club organizer, or location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="w-full md:w-auto px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="date_asc">Sort: Upcoming Dates (First)</option>
              <option value="date_desc">Sort: Later Dates</option>
              <option value="newest">Sort: Recently Added</option>
              <option value="title_asc">Sort: Event Title (A-Z)</option>
              <option value="capacity_desc">Sort: Largest Capacity</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilters({ category: cat })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Date Filter & Available Only Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Date Range:</span>
            {[
              { id: 'all', label: 'Any Date' },
              { id: 'upcoming', label: 'Upcoming Only' },
              { id: 'this_week', label: 'Next 7 Days' },
              { id: 'this_month', label: 'This Month' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => updateFilters({ dateFilter: d.id })}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  dateFilter === d.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => updateFilters({ availableOnly: e.target.checked })}
              className="w-4 h-4 rounded-sm text-brand-600 focus:ring-brand-500 border-slate-300"
            />
            <span className="font-semibold text-slate-700">Available Seats Only</span>
          </label>
        </div>
      </div>

      {/* Events Grid / Loading / Error States */}
      {error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-700">
          <p className="font-bold text-base mb-1">Failed to fetch events</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
          >
            Retry Connection
          </button>
        </div>
      ) : loading ? (
        <EventGridSkeleton count={6} />
      ) : events.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => updateFilters({ page: page - 1 })}
                className="p-2 rounded-xl border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                <span>Page</span>
                <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                  {page}
                </span>
                <span>of {totalPages}</span>
              </div>
              <button
                disabled={page >= totalPages}
                onClick={() => updateFilters({ page: page + 1 })}
                className="p-2 rounded-xl border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No events match your criteria"
          description="Try broadening your search term, clearing category filters, or viewing upcoming events."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};
