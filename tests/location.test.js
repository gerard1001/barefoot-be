import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import app from '../src/app';
import locationService from '../src/services/location.service';
import { locationData } from './mock/location.mock';

chai.use(chaiHttp);

describe('LOCATION TESTING', () => {
  it('should not create a location when a loggedIn user is Travel admin and there is a field missing', async () => {
    const logIn = await request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .post('/api/v1/locations')
      .set('Authorization', data.token)
      .send({
        name: 'Muhazi',
        description: '',
        latitude: 456789,
        longitude: 45678,
        country: 'Rwanda'
      });
    expect(res.status).to.be.equal(400);
  });

  it('should create a location', async () => {
    const res = await request(app).post('/api/v1/locations').send({
      name: 'Muhazi',
      description: 'Africa',
      latitude: 456.12342432423,
      longitude: 89.24243234242,
      country: 'Rwanda'
    });
    expect(res.status).to.be.equal(201);
  });

  it('should find all locations', async () => {
    const res = await request(app).get('/api/v1/locations');
    expect(res.status).to.be.equal(200);
  });

  it('should find most visited locations', async () => {
    const res = await request(app).get('/api/v1/locations?mostvisited=true');
    expect(res.status).to.be.equal(200);
  });

  it('should find a specific locations', async () => {
    const createlocation = await locationService.createLocation(locationData);
    createlocation.save();
    const res = await request(app).get(
      `/api/v1/locations/${createlocation.dataValues.id}`
    );
    expect(res.status).to.be.equal(200);
  });
  it('should find a specific locations', async () => {
    const createlocation = await locationService.createLocation(locationData);
    createlocation.save();
    const res = await request(app).get(`/api/v1/locations/200`);
    expect(res.status).to.be.equal(404);
  });

  it('should not delete location if a user is not loggedIn', async () => {
    const createlocation = await locationService.createLocation(locationData);
    createlocation.save();
    const res = await request(app).delete(
      `/api/v1/locations/${createlocation.dataValues.id}?name=${createlocation.dataValues.name}&country=${createlocation.dataValues.country}`
    );
    expect(res.status).to.be.equal(403);
  });

  it('should not delete a location if loggedIn user is not travel admin', async () => {
    const createlocation = await locationService.createLocation(locationData);
    createlocation.save();
    const logIn = await request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await request(app)
      .delete(
        `/api/v1/locations/${createlocation.dataValues.id}?name=${createlocation.dataValues.name}&country=${createlocation.dataValues.country}`
      )
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(200);
  });
});
