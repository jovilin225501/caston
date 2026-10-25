import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import ContactMessage from '../models/ContactMessage.js';

export const seedDevDataIfNeeded = async () => {
  try {
    const existingEventsCount = await Event.countDocuments();
    if (existingEventsCount > 0) {
      return;
    }

    console.log('[DevSeeder] Empty database detected in dev mode. Populating initial campus events and accounts...');

    // 1. Admin
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
      console.log(`[DevSeeder] Created default admin account: ${admin.email}`);
    }

    // 2. Demo Student
    const studentEmail = 'alex.rivers@campus.edu';
    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      student = await User.create({
        name: 'Alex Rivers',
        email: studentEmail,
        password: 'Student@123456',
        role: 'student',
        department: 'Computer Science & Engineering',
        studentId: 'CS2026-042',
        bio: 'Full-stack enthusiast, competitive coder, and student club lead.',
      });
      console.log(`[DevSeeder] Created demo student account: ${student.email}`);
    }

    // 3. Realistic Events
    const sampleEvents = [
      {
        title: 'Campus HackAI 2026: 36-Hour National Hackathon',
        description:
          'Join over 400 collegiate developers, designers, and innovators for a 36-hour sprint building AI-powered real-world solutions. Mentorship from top industry engineers, hardware labs, and prizes worth $10,000.',
        category: 'Technical',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
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
    console.log(`[DevSeeder] Populated ${createdEvents.length} initial campus events.`);

    // 4. Initial registration for demo student
    if (createdEvents.length > 0 && student) {
      await Registration.create({
        event: createdEvents[0]._id,
        user: student._id,
        status: 'Confirmed',
        notes: 'Registered via initial seed',
      });
      await Event.findByIdAndUpdate(createdEvents[0]._id, { $inc: { registeredCount: 1 } });
    }

    // 5. Initial Contact Message
    await ContactMessage.create({
      name: 'Samantha Lee',
      email: 'samantha.lee@campus.edu',
      subject: 'Inquiry regarding Club Booth Registration',
      message: 'Hello! Our Robotics Club would love to set up an interactive booth during HackAI weekend.',
      status: 'New',
    });
    console.log('[DevSeeder] Dev initialization completed successfully.');
  } catch (err) {
    console.warn('[DevSeeder] Dev seeding skipped or encountered error:', err.message);
  }
};
