import React from 'react';
import { CalendarX, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = CalendarX,
  title = 'No events found',
  description = 'Try adjusting your search criteria or explore other event categories.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white/70 rounded-3xl border border-dashed border-slate-300 max-w-xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
