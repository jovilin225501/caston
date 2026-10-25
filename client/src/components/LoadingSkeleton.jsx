import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-4 bg-slate-200 rounded-md w-1/2" />
        <div className="h-4 bg-slate-200 rounded-md w-2/3" />
        <div className="pt-2">
          <div className="h-2 bg-slate-200 rounded-full w-full" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-full mt-4" />
      </div>
    </div>
  );
};

export const EventGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="h-4 bg-slate-200 rounded-md w-1/2 mb-3" />
          <div className="h-8 bg-slate-200 rounded-md w-3/4" />
        </div>
      ))}
    </div>
  );
};
