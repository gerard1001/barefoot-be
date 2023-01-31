import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import app from '../src/app';
import roomService from '../src/services/rooms.service';
import { roomData } from './mock/room.mock';
import { bookingData, badBookingData } from './mock/booking.mock';

chai.use(chaiHttp);
const { createRoom } = roomService;
describe('BOOKING ENDPOINTS TESTS', () => {
  it('should not book a room if a user is not loggedIn', async () => {
    const room = await createRoom(roomData);
    room.save();
    const res = await request(app)
      .post(`/api/v1/rooms/${room.dataValues.id}/booking`)
      .send(bookingData);
    expect(res.status).to.be.equal(403);
  });

  it('should not book a room if a user is not a requester', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const room = await createRoom(roomData);
    room.save();
    const res = await request(app)
      .post(`/api/v1/rooms/${room.dataValues.id}/booking`)
      .set('Authorization', data.token)
      .field('checkinDate', new Date('2025-04-01').toISOString())
      .field('checkoutDate', new Date('2025-04-03').toISOString());
    expect(res.status).to.be.equal(403);
  });
  it('should book a room if a user is a requester', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .post(`/api/v1/rooms/1/booking`)
      .set('Authorization', data.token)
      .send({ checkinDate: '2022-12-10', checkoutDate: '2022-12-24' });
    expect(res.status).to.be.equal(200);
  });

  it('should not book a room with wrong dates', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .post(`/api/v1/rooms/2/booking`)
      .set('Authorization', data.token)
      .send(badBookingData);
    expect(res.status).to.be.equal(400);
  });

  it('should not book a room if it was booked already', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .post(`/api/v1/rooms/5/booking`)
      .set('Authorization', data.token)
      .field('checkinDate', new Date('2025-04-01').toISOString())
      .field('checkoutDate', new Date('2025-04-03').toISOString());
    expect(res.status).to.be.equal(404);
  });

  it('should list all bookings of a room', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .get(`/api/v1/rooms/1/booking`)
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(200);
  });
  it('should list all bookings of a user', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .get(`/api/v1/rooms/booking`)
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(200);
  });

  it('should return booking of a logged in requester only', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .get(`/api/v1/rooms/1/booking`)
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(200);
  });

  it('should not get bookings of a logged in requester if no booking', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .get(`/api/v1/rooms/5/booking`)
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(404);
  });
  it('should retrieve a specific room booking', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .get(`/api/v1/rooms/1/booking/1`)
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(200);
  });

  it('should not return any booking', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .get(`/api/v1/rooms/1/booking/455`)
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(404);
  });

  it('should update a specific room booking', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .patch(`/api/v1/rooms/1/booking/1`)
      .set('Authorization', data.token)
      .send({ status: 'APPROVED' });
    expect(res.status).to.be.equal(200);
  });

  it('requester should update his room booking', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .patch(`/api/v1/rooms/4/booking/6`)
      .set('Authorization', data.token)
      .field('checkinDate', '2025-04-01')
      .field('checkoutDate', '2025-04-03');
    expect(res.status).to.be.equal(200);
  });

  it('requester should not update approved or rejected booking', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .patch(`/api/v1/rooms/3/booking/5`)
      .set('Authorization', data.token)
      .field('checkinDate', '2025-04-01')
      .field('checkoutDate', '2025-04-03');
    expect(res.status).to.be.equal(400);
  });
  it('requester should not update a booking he did not create', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .patch(`/api/v1/rooms/2/booking/3`)
      .set('Authorization', data.token)
      .field('checkinDate', new Date('2025-04-01').toISOString())
      .field('checkoutDate', new Date('2025-04-03').toISOString());
    expect(res.status).to.be.equal(404);
  });

  it('requester should not update a booking if none booked', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .patch(`/api/v1/rooms/1/booking/20`)
      .set('Authorization', data.token)
      .send({ checkinDate: new Date(), checkoutDate: new Date() });
    expect(res.status).to.be.equal(404);
  });
  it('should not update a specific room booking when wrong inputs', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .patch(`/api/v1/rooms/1/booking/1`)
      .set('Authorization', data.token)
      .field('status', 'ok');
    expect(res.status).to.be.equal(400);
  });
  it('requester should delete his booking', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .delete(`/api/v1/rooms/4/booking/7`)
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(201);
  });

  it('travel admin should update a booking in his accommodation', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .patch(`/api/v1/rooms/5/booking/3`)
      .set('Authorization', data.token)
      .send({ status: 'APPROVED' });
    expect(res.status).to.be.equal(200);
  });

  it('should not allow travel admin to update a booking outside his accommodation', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .patch(`/api/v1/rooms/4/booking/8`)
      .set('Authorization', data.token)
      .send({ status: 'APPROVED' });
    expect(res.status).to.be.equal(403);
  });

  it('super admin should update a specific room booking', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'SUPER_ADMIN@gmail.com',
      password: 'SUPER_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .patch(`/api/v1/rooms/2/booking/2`)
      .set('Authorization', data.token)
      .field('status', 'APPROVED');
    expect(res.status).to.be.equal(200);
  });
});
