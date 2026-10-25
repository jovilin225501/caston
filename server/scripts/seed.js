import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Event from '../src/models/Event.js';
import Registration from '../src/models/Registration.js';
import ContactMessage from '../src/models/ContactMessage.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Database connected.');

    const force = process.argv.includes('--force');

    if (force) {
      console.log('[Seed] --force flag detected. Cleaning existing records...');
      await Registration.deleteMany({});
      await Event.deleteMany({});
      await User.deleteMany({});
      await ContactMessage.deleteMany({});
      console.log('[Seed] Existing collections cleaned.');
    }

    // 1. Create or Find Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@campusconnect.edu';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'Campus Administrator',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@Campus2026!',
        role: 'admin',
        department: 'Student Affairs & Dean Office',
        studentId: 'STAFF-ADMIN-01',
        bio: 'Chief Coordinator for Campus Activities and Events Management Council.',
      });
      console.log(`[Seed] Created admin account: ${admin.email}`);
    } else {
      console.log(`[Seed] Admin already exists: ${admin.email}`);
    }

    // 2. Create Demo Students
    const student1Email = 'alex.rivers@campus.edu';
    let student1 = await User.findOne({ email: student1Email });
    if (!student1) {
      student1 = await User.create({
        name: 'Alex Rivers',
        email: student1Email,
        password: 'Student@123456',
        role: 'student',
        department: 'Computer Science & Engineering',
        studentId: 'CS2026-042',
        bio: 'Full-stack enthusiast, competitive coder, and president of the Open Source Guild.',
      });
      console.log(`[Seed] Created demo student: ${student1.email}`);
    }

    const student2Email = 'maya.chen@campus.edu';
    let student2 = await User.findOne({ email: student2Email });
    if (!student2) {
      student2 = await User.create({
        name: 'Maya Chen',
        email: student2Email,
        password: 'Student@123456',
        role: 'student',
        department: 'Design & Media Arts',
        studentId: 'DA2026-118',
        bio: 'UI/UX Designer, digital illustrator, and photography enthusiast.',
      });
      console.log(`[Seed] Created demo student: ${student2.email}`);
    }

    // 3. Create Sample Events if none exist
    const existingEventsCount = await Event.countDocuments();
    if (existingEventsCount === 0 || force) {
      const sampleEvents = [
        {
          title: 'Campus HackAI 2026: 36-Hour National Hackathon',
          description:
            'Join over 400 collegiate developers, designers, and innovators for a 36-hour sprint building AI-powered real-world solutions. Mentorship from top industry engineers, hardware labs, and prizes worth $10,000.',
          category: 'Technical',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
          time: '09:00 AM - 09:00 PM (36 Hours)',
          location: 'Innovation Hub, Building C, Central Campus',
          organizer: 'Computer Science Society & Google DSC',
          capacity: 150,
          registeredCount: 0,
          image:
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
          tags: ['Hackathon', 'AI', 'Coding', 'Prizes'],
          status: 'Upcoming',
          createdBy: admin._id,
        },
        {
          title: 'Spring Symphony: Annual Campus Music & Arts Gala',
          description:
            'A spectacular evening of classical orchestra, live indie bands, cultural dances, and multimedia art exhibitions hosted by the Fine Arts Collective. Food trucks and student art market on site.',
          category: 'Cultural',
          date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // in 12 days
          time: '06:00 PM - 10:30 PM',
          location: 'Grand Open Air Amphitheatre',
          organizer: 'Fine Arts & Music Student Collective',
          capacity: 350,
          registeredCount: 0,
          image:
            'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
          tags: ['Music', 'Art', 'Dance', 'Festival'],
          status: 'Upcoming',
          createdBy: admin._id,
        },
        {
          title: 'Inter-Department Futsal & Basketball Championship',
          description:
            'Annual inter-department sports tournament featuring men and women five-a-side futsal and 3v3 basketball. Cheer for your department and compete for the prestigious Chancellor’s Trophy.',
          category: 'Sports',
          date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
          time: '04:00 PM - 08:30 PM',
          location: 'University Sports Complex, Arena 1',
          organizer: 'Department of Athletics & Recreation',
          capacity: 200,
          registeredCount: 0,
          image:
            'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
          tags: ['Sports', 'Futsal', 'Basketball', 'Championship'],
          status: 'Upcoming',
          createdBy: admin._id,
        },
        {
          title: 'Mastering Modern Full-Stack Cloud Architecture',
          description:
            'Hands-on masterclass led by Principal Cloud Architects. Learn how to containerize microservices, deploy resilient CI/CD pipelines, and scale distributed MERN applications with zero downtime.',
          category: 'Workshop',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          time: '02:00 PM - 05:30 PM',
          location: 'Advanced Computing Lab 4, Tech Block',
          organizer: 'IEEE Student Chapter',
          capacity: 60,
          registeredCount: 0,
          image:
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
          tags: ['Cloud', 'MERN', 'DevOps', 'Workshop'],
          status: 'Upcoming',
          createdBy: admin._id,
        },
        {
          title: 'Campus Career Fair: Tech, Finance & Creative Industries',
          description:
            'Connect directly with recruiters and hiring managers from 45+ premier technology companies, startups, and design firms. Bring copies of your resume for on-the-spot internship and graduate interviews.',
          category: 'Career',
          date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          time: '10:00 AM - 04:00 PM',
          location: 'Convention Center, Halls A & B',
          organizer: 'Office of Career Advancement & Alumni Relations',
          capacity: 500,
          registeredCount: 0,
          image:
            'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
          tags: ['Career', 'Jobs', 'Internships', 'Networking'],
          status: 'Upcoming',
          createdBy: admin._id,
        },
        {
          title: 'Eco-Campus Clean-up Drive & Botanical Gardening',
          description:
            'Join the Green Campus Alliance in transforming our urban campus garden and nature trail. Volunteers receive a certificate of community service, eco-friendly seed kit, and free refreshments.',
          category: 'Social',
          date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
          time: '08:30 AM - 12:00 PM',
          location: 'Botanical Garden & North Lawn',
          organizer: 'Green Earth Student Alliance',
          capacity: 80,
          registeredCount: 0,
          image:
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
          tags: ['Volunteering', 'Environment', 'Community', 'Green'],
          status: 'Upcoming',
          createdBy: admin._id,
        },
      ];

      const createdEvents = await Event.insertMany(sampleEvents);
      console.log(`[Seed] Seeded ${createdEvents.length} sample events.`);

      // Create a sample registration for student1
      if (createdEvents.length > 0 && student1) {
        const firstEvent = createdEvents[0];
        await Registration.create({
          event: firstEvent._id,
          user: student1._id,
          status: 'Confirmed',
          notes: 'Looking forward to the hackathon AI tracks!',
        });
        await Event.findByIdAndUpdate(firstEvent._id, { $inc: { registeredCount: 1 } });
        console.log(`[Seed] Created demo registration for ${student1.name} on event ${firstEvent.title}`);
      }
    } else {
      console.log(`[Seed] Events already exist (${existingEventsCount} events). Skipping sample events insert.`);
    }

    // 4. Sample contact message
    const contactCount = await ContactMessage.countDocuments();
    if (contactCount === 0 || force) {
      await ContactMessage.create({
        name: 'Samantha Lee',
        email: 'samantha.lee@campus.edu',
        subject: 'Inquiry regarding Club Booth Registration',
        message:
          'Hello! Our Robotics Club would love to set up an interactive booth during the upcoming Campus HackAI weekend. Whom should we contact for table allotment?',
        status: 'New',
      });
      console.log('[Seed] Created sample contact inquiry.');
    }

    console.log('\n===============================================');
    console.log('🎉 Seed script completed successfully!');
    console.log('Admin Credentials:');
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@Campus2026!'}`);
    console.log('Student Credentials:');
    console.log(`  Email:    ${student1Email}`);
    console.log(`  Password: Student@123456`);
    console.log('===============================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Error]: ${err.message}`);
    process.exit(1);
  }
};

seedData();
