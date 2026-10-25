import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Event from '../src/models/Event.js';
import Registration from '../src/models/Registration.js';

describe('CampusConnect Comprehensive Backend API Tests', () => {
  let adminToken = '';
  let studentToken = '';
  let testEventId = '';

  before(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  after(async () => {
    await disconnectDB();
  });

  test('GET /api/health should return 200 and operational status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.strictEqual(res.body.database, 'connected');
  });

  test('POST /api/auth/register should register a new student', async () => {
    const testEmail = `student_${Date.now()}@test.edu`;
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Student',
      email: testEmail,
      password: 'Password123!',
      studentId: 'STU-999',
      department: 'Computer Science',
    });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.role, 'student');
    studentToken = res.body.token;
  });

  test('POST /api/auth/register with adminPasscode should register an admin', async () => {
    const adminEmail = `admin_${Date.now()}@test.edu`;
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Admin',
      email: adminEmail,
      password: 'AdminPassword123!',
      adminPasscode: process.env.ADMIN_PASSCODE || 'CampusAdmin@2026',
    });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'admin');
    adminToken = res.body.token;
  });

  test('GET /api/auth/me with valid student token should return profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${studentToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.name, 'Test Student');
  });

  test('POST /api/events should allow admin to create an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Automated Test Hackathon',
        description: 'Testing event registration and capacity constraints in unit tests.',
        category: 'Technical',
        date: new Date(Date.now() + 86400000),
        time: '10:00 AM - 5:00 PM',
        location: 'Lab 101',
        organizer: 'Code Club',
        capacity: 2,
      });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.event.capacity, 2);
    testEventId = res.body.event._id;
  });

  test('POST /api/events/:id/register should allow student to register', async () => {
    const res = await request(app)
      .post(`/api/events/${testEventId}/register`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ notes: 'First registration' });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.registration.ticketCode);
  });

  test('POST /api/events/:id/register should reject duplicate registration by the same student', async () => {
    const res = await request(app)
      .post(`/api/events/${testEventId}/register`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send();

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  test('GET /api/registrations/my should return registered events for the student', async () => {
    const res = await request(app)
      .get('/api/registrations/my')
      .set('Authorization', `Bearer ${studentToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.count, 1);
  });

  test('DELETE /api/events/:id/register should successfully cancel registration', async () => {
    const res = await request(app)
      .delete(`/api/events/${testEventId}/register`)
      .set('Authorization', `Bearer ${studentToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  test('POST /api/contact should accept valid inquiries', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Inquiry Tester',
      email: 'tester@test.edu',
      subject: 'Question about sponsorship',
      message: 'Hello, how can our organization sponsor campus events?',
    });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
  });
});
