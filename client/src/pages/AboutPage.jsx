import React from 'react';
import {
  GraduationCap,
  Layers,
  Shield,
  Zap,
  Code,
  Users,
  Database,
  Server,
  Globe,
  CheckCircle,
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
          <GraduationCap className="w-4 h-4" />
          <span>Full-Stack College Capstone & Internship Project</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Empowering Campus Communities Through Technology
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          CampusConnect was engineered to solve the persistent fragmentation in collegiate extracurricular activities, replacing spreadsheets and bulletin boards with a unified, real-time MERN platform.
        </p>
      </div>

      {/* Problem vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            01
          </div>
          <h2 className="text-xl font-bold text-slate-900">The Campus Challenge</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            University clubs, technical chapters, and student councils face high drop-off rates due to disparate registration links, over-capacity room bookings, and manual attendance tracking that waste valuable academic hours.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            02
          </div>
          <h2 className="text-xl font-bold text-slate-900">The CampusConnect Solution</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            A centralized activity hub offering instant atomic event registrations, official verification passes, student registration dashboards, and automated attendee capacity management for campus administrators.
          </p>
        </div>
      </div>

      {/* MERN Architecture Overview */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-2">
            Technical Architecture
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Built on the Modern MERN Stack
          </h2>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Engineered with a clean separation of concerns, secure REST endpoints, robust indexing, and resilient production deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
            <Database className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-base">MongoDB & Mongoose</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Document models for Users, Events, Registrations, and Messages with compound indexing to strictly guarantee RSVP uniqueness and capacity limits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
            <Server className="w-6 h-6 text-brand-400" />
            <h3 className="font-bold text-base">Express.js API</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modular controllers, JWT auth middleware, centralized error handling, and express-rate-limit protection against brute-force attempts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h3 className="font-bold text-base">React 18 & Vite</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Single-page application powered by Vite, React Router v6, custom AuthContext, and centralized Axios service with automatic token injection.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
            <Code className="w-6 h-6 text-purple-400" />
            <h3 className="font-bold text-base">Tailwind & Render</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailored design system, accessible UI elements, and automated deployment configuration using Render Static Sites and Web Services.
            </p>
          </div>
        </div>
      </div>

      {/* Core Highlights Checklist */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Key Engineering Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Atomic Seat Reservation:</strong> Prevents race conditions when concurrent students register for the final seat.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Role-Based Access Control:</strong> Secure boundaries preventing unauthorized access to coordinator tools.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Zero Local Storage Leakage:</strong> Sensitive passwords hashed exclusively with bcrypt; tokens verified via JWT middleware.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Digital Campus Passes:</strong> Automatically generated readable pass codes with printable passes and verification tags.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
