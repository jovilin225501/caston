import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Code2, Sparkles, MapPin, Mail, Phone, Calendar } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Campus<span className="text-brand-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering college students to discover extracurricular activities, register for workshops, and actively lead campus communities.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60 font-mono text-brand-400">
                <Code2 className="w-3.5 h-3.5" /> MERN Stack Project
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  All Campus Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technical" className="hover:text-white transition-colors">
                  Hackathons & Tech
                </Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="hover:text-white transition-colors">
                  Cultural & Arts Fests
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="hover:text-white transition-colors">
                  Sports Tournaments
                </Link>
              </li>
              <li>
                <Link to="/events?category=Workshop" className="hover:text-white transition-colors">
                  Professional Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Hub & Admin */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Student Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  My Registration Desk
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Vision
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Help Desk & Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Coordinator / Admin Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Support Desk */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Campus Headquarters
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Student Affairs Center, North Quad Building 4, University Campus</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>events@campusconnect.edu</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+1 (800) 246-CAMPUS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusConnect Platform. Designed for Full-Stack College Capstone & Internship Demo.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Students
            </span>
            <span>•</span>
            <span className="text-slate-400">Deployed on Render</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
