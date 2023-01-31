import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import path from 'path';
import app from '../src/app';
import roomService from '../src/services/rooms.service';
import accommodationService from '../src/services/accommodations.service';
import roomData from './mock/room.mock';
import accommodatonData from './mock/accommodation.mock';

chai.use(chaiHttp);

const { createRoom } = roomService;
const { createAccommodation } = accommodationService;

describe('ROOM ENDPOINTS TEST', () => {
  it('should not create a room if a user is not loggedIn', async () => {
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app)
      .post(`/api/v1/accommodations/${accommodation.dataValues.id}/rooms`)
      .set('Content-Type', 'multipart/form-data')
      .field('cost', '1234')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(403);
  });

  it('should not create a room if loggedIn user is not travel admin', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app)
      .post(`/api/v1/accommodations/${accommodation.dataValues.id}/rooms`)
      .set('Authorization', data.token)
      .field('price', '')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(403);
  });

  it('should not create a room when provided with all room fields and travel Admin loggedIn but missinga field', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app)
      .post(`/api/v1/accommodations/${accommodation.dataValues.id}/rooms`)
      .set('Authorization', data.token)
      .field('price', '')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(400);
  });

  it('should create a room when provided with all room fields and travel Admin loggedIn', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app)
      .post(`/api/v1/accommodations/${accommodation.dataValues.id}/rooms`)
      .set('Authorization', data.token)
      .field('price', '1234')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(200);
  });

  it('should list all rooms of an accommodation', async () => {
    const room = await createRoom(roomData);
    room.save();
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();

    const res = await request(app).get(
      `/api/v1/accommodations/${accommodation.dataValues.id}/rooms`
    );
    expect(res.status).to.be.equal(200);
  });

  it('should not list rooms if an accommodation does not exists', async () => {
    const room = await createRoom(roomData);
    room.save();

    const res = await request(app).get(`/api/v1/accommodations/222/rooms`);
    expect(res.status).to.be.equal(404);
  });

  it('should list a specific room in a specific accommodation', async () => {
    const room = await createRoom(roomData);
    room.save();
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app).get(
      `/api/v1/accommodations/${accommodation.dataValues.id}/rooms/${room.dataValues.id}`
    );
    expect(res.status).to.be.equal(200);
  });

  it('should not list a specific room if an accommodation does not exist', async () => {
    const room = await createRoom(roomData);
    room.save();
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();

    const res = await request(app).get(
      `/api/v1/accommodations/140/rooms/${room.dataValues.id}`
    );
    expect(res.status).to.be.equal(404);
  });

  it('should not list a specific room if an room does not exist', async () => {
    const room = await createRoom(roomData);
    room.save();
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();

    const res = await request(app).get(
      `/api/v1/accommodations/${accommodation.dataValues.id}/rooms/100`
    );
    expect(res.status).to.be.equal(404);
  });

  it('should not update a room if a user is not loggedIn', async () => {
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app)
      .post(`/api/v1/accommodations/${accommodation.dataValues.id}/rooms`)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      )
      .set('Content-Type', 'multipart/form-data')
      .field('cost', '1234')
      .field('details', 'break fast')
      .field('accommodation_id', 1);
    expect(res.status).to.be.equal(403);
  });

  it('should not update a room if loggedIn user is not travel admin', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app)
      .post(`/api/v1/accommodations/${accommodation.dataValues.id}/rooms`)
      .set('Authorization', data.token)
      .field('price', '1234')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(403);
  });

  it('should not update a room when provided with all room fields and travel Admin loggedIn but missinga field', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res1 = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('authorization', data.token)
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 22)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    const res = await request(app)
      .post(`/api/v1/accommodations/${res1.body.data.id}/rooms`)
      .set('Authorization', data.token)
      .field('price', '')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(400);
  });

  it('should update a specific room of a specific accommodation', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res1 = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('authorization', data.token)
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 21)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    const res2 = await request(app)
      .post(`/api/v1/accommodations/${res1.body.data.id}/rooms`)
      .set('Authorization', data.token)
      .field('price', '123456')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    const res = await request(app)
      .put(
        `/api/v1/accommodations/${res1.body.data.id}/rooms/${res2.body.room.id}`
      )
      .set('Authorization', data.token)
      .field('price', '43212343')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(200);
  });

  it('should not delete a room of a specific accommodation if the user is not loggeIn', async () => {
    const room = await createRoom(roomData);
    room.save();
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app).delete(
      `/api/v1/accommodations/${accommodation.dataValues.id}/rooms/${room.dataValues.id}`
    );
    expect(res.status).to.be.equal(403);
  });

  it('should not delete a room of a specific accommodation if loggeIn user is not Travel Admin', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const room = await createRoom(roomData);
    room.save();
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app)
      .delete(
        `/api/v1/accommodations/${accommodation.dataValues.id}/rooms/${room.dataValues.id}`
      )
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(403);
  });

  it('should delete a room of a specific accommodation', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const room = await createRoom(roomData);
    room.save();
    const accommodation = await createAccommodation(accommodatonData);
    accommodation.save();
    const res = await request(app)
      .delete(
        `/api/v1/accommodations/${accommodation.dataValues.id}/rooms/${room.dataValues.id}`
      )
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(200);
  });

  it('should not find an accommodation while creating a room', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .post(`/api/v1/accommodations/2345/room`)
      .set('Authorization', data.token)
      .field('price', '234433')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(404);
  });

  it('should not create a room if there is a missing field', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .post(`/api/v1/accommodations/5/rooms`)
      .set('Authorization', data.token)
      .field('price', '')
      .field('details', 'break fast')
      .field('accommodation_id', 1)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(400);
  });
  it('should not find a route', async () => {
    const res = await request(app).get('/api/v1');
    expect(res.status).to.be.equal(404);
  });
});
