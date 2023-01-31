import { stub, assert } from 'sinon';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import tripService from '../src/services/trip.service';
import {
  tripRequest,
  checkValidation,
  multiCityTripRequest,
  multiCityTripRequestAcc
} from './dammyData';
import 'dotenv/config';

chai.use(chaiHttp);

describe('TRIP END-POINT TESTING', () => {
  let reqToken, reqToken2, manToken, superToken;
  before(async () => {
    const login = await chai
      .request(app)
      .post('/api/v1/users/login')
      .send({ email: 'REQUESTER@gmail.com', password: 'REQUESTER2gmail' });

    reqToken = login.body.token;
  });
  before(async () => {
    const login = await chai
      .request(app)
      .post('/api/v1/users/login')
      .send({ email: 'REQUESTER1@gmail.com', password: 'REQUESTER2gmail' });
    reqToken2 = login.body.token;
  });
  before(async () => {
    const login = await chai
      .request(app)
      .post('/api/v1/users/login')
      .send({ email: 'MANAGER@gmail.com', password: 'MANAGER2gmail' });

    manToken = login.body.token;
  });
  before(async () => {
    const login = await chai
      .request(app)
      .post('/api/v1/users/login')
      .send({ email: 'SUPER_ADMIN@gmail.com', password: 'SUPER_ADMIN2gmail' });

    superToken = login.body.token;
  });

  it('Should create the Trip  Request while logged as Requester', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);
    expect(res).to.have.status([201]);
  });

  it('Should not create the Trip  Request if an error occurred', async () => {
    const createTrip = stub(tripService, 'multiCityCreate').rejects(
      new Error('Database failed')
    );

    const res = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);
    assert.calledOnce(createTrip);
    expect(res).to.have.status(500);
    createTrip.restore();
  });

  it('Should not create the Trip if accommodation dont exist', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        depart_location_id: 2,
        arrival_location: [
          {
            accommodation_id: 100,
            days: 2
          },
          {
            accommodation_id: 2,
            days: 1
          }
        ],
        tripDate: '2022-10-12',
        returnDate: '2023-12-10',
        reason: 'Tourism'
      });
    expect(res).to.have.status([400]);
  });

  it('Should not create the Trip  Request while logged as Requester and not follow the validatation', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(checkValidation);
    expect(res).to.have.status([400]);
  });

  it('Should not create the Trip  Request if requester not assigned a manager', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken2}`)
      .send(tripRequest);
    expect(res).to.have.status([400]);
  });

  it('Should not create the Trip while not logged in ', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips')
      .send(tripRequest)
      .end((err, res) => {
        expect(res).to.have.status([403]);
        done();
      });
  });

  it('Should not create the Trip while date to leave is greater than date to return ', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        arrival_location_id: 1,
        depart_location_id: 2,
        accommodation_id: 1,
        tripDate: '2023-10-12',
        returnDate: '2021-12-10',
        reason: 'Tourism'
      })
      .end((err, res) => {
        expect(res).to.have.status([400]);
        done();
      });
  });

  it('Should not create the Trip while days of trip are greater than dates', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        depart_location_id: 2,
        arrival_location: [
          {
            accommodation_id: 100,
            days: 20
          },
          {
            accommodation_id: 2,
            days: 10
          }
        ],
        tripDate: '2021-10-01',
        returnDate: '2021-10-10',
        reason: 'Tourism'
      })
      .end((err, res) => {
        expect(res).to.have.status([400]);
        done();
      });
  });

  it('Should not create the Trip while logged in with invalid token ', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer kkkkkkkkkkkkk`)
      .send(tripRequest)
      .end((err, res) => {
        expect(res).to.have.status([401]);
        done();
      });
  });

  it('Should retrieve all user Trips with pending status while logged in as requester', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send();
    expect(res).to.have.status([200]);
  });
  it('Should retrieve all user Trips with pending status while logged in as super_admin', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${superToken}`)
      .send();
    expect(res).to.have.status([200]);
  });

  it('Should not retrieve all user Trips if error occured', async () => {
    const findAllTrips = stub(tripService, 'findAllTrips').rejects(
      new Error('Database failed')
    );

    const res = await chai
      .request(app)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);
    assert.calledOnce(findAllTrips);
    expect(res).to.have.status(500);
    findAllTrips.restore();
  });

  it('Should not retrieve all user Trips with pending status While not logged in   ', (done) => {
    chai
      .request(app)
      .get('/api/v1/trips')
      .send()
      .end((err, res) => {
        expect(res).to.have.status([403]);
        done();
      });
  });

  it(' should retrieve all Trip requests owned while logged in as manager', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${manToken}`)
      .send();
    expect(res).to.have.status([200]);
  });

  it(' should retrieve all Trip requests owned while logged in as manager with querries', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/trips/?page=1&limit=3')
      .set('Authorization', `Bearer ${manToken}`)
      .send();
    expect(res).to.have.status([200]);
  });

  it(' should not retrieve all Trip requests owned while logged in as manager if the service returned an error', async () => {
    const findAllTrips = stub(tripService, 'findAllTrips').rejects(
      new Error('Database failed')
    );

    const res = await chai
      .request(app)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${manToken}`);
    assert.calledOnce(findAllTrips);
    expect(res).to.have.status(500);
    findAllTrips.restore();
  });
  it(' should retrieve all Trip requests owned while logged in as super_admin', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${superToken}`)
      .send();
    expect(res).to.have.status([200]);
  });

  it(' Should not retrieve all Trip requests owned while not logged in as manager', (done) => {
    chai
      .request(app)
      .get('/api/v1/trips')
      .send()
      .end((err, res) => {
        expect(res).to.have.status([403]);
        done();
      });
  });

  it('Should  Update Trip request which has pending status while logged in user ', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/trips/2`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);
    expect(res).to.have.status([200]);
  });

  it('Should  not update the trip requests that are approved', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/trips/1`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);
    expect(res).to.have.status([400]);
  });

  it("Should  not update the trip requests that doesn't exist", async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/trips/2000`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);
    expect(res).to.have.status([404]);
  });

  it('While not logged in  Should not Update Trip request which has pending status', async () => {
    const trip = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);

    const res = await chai
      .request(app)
      .put(`/api/v1/trips/${trip.id}`)
      .send(tripRequest);
    expect(res).to.have.status([403]);
  });

  it('Should not update the Trip  Request if an error occurred', async () => {
    const createTrip = stub(tripService, 'updateMultiCity').rejects(
      new Error('Database failed')
    );

    const res = await chai
      .request(app)
      .put('/api/v1/trips/2')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);
    assert.calledOnce(createTrip);
    expect(res).to.have.status(500);
    createTrip.restore();
  });

  it('Should delete the trip requests that are in pending status', async () => {
    const trip = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);

    const res = await chai
      .request(app)
      .delete(`/api/v1/trips/${trip.body.data.id}`)
      .set('Authorization', `Bearer ${reqToken}`);
    expect(res).to.have.status([200]);
  });

  it('Should  not delete the trip requests that are approved', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/trips/1`)
      .set('Authorization', `Bearer ${reqToken}`);
    expect(res).to.have.status([400]);
  });

  it('Should  not delete the trip requests that are in pending status while not logged in', async () => {
    const res = await chai.request(app).delete(`/api/v1/trips/1`).send();
    expect(res).to.have.status([403]);
  });

  it('should reject and approve trip request', async () => {
    const trip = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);
    const res = await chai
      .request(app)
      .patch(`/api/v1/trips/${trip.body.data.id}`)
      .set('Authorization', `Bearer ${manToken}`)
      .send({ status: 'REJECTED' });
    expect(res).to.have.status([200]);
  });
  it('should reject and approve trip request', async () => {
    const trip = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(tripRequest);
    const res = await chai
      .request(app)
      .patch(`/api/v1/trips/${trip.body.data.id}`)
      .set('Authorization', `Bearer ${manToken}`)
      .send({ status: 'REJECTEDEEEE' });
    expect(res).to.have.status([400]);
  });
  it('should not approve or  reject with invalid status ', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/trips/899`)
      .set('Authorization', `Bearer ${manToken}`)
      .send({ status: 'REJECT' })
      .end((err, res) => {
        expect(res).to.have.status([404]);
        done();
      });
  });
  it('should not approve or  reject un existing request', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/trips/899`)
      .set('Authorization', `Bearer ${manToken}`)
      .send({ status: 'REJECTED' })
      .end((err, res) => {
        expect(res).to.have.status([404]);
        done();
      });
  });

  it('Should  not create the a multi city trip  Request while logged as Requester and have same accommodation Id in arrival locations', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(multiCityTripRequest);
    expect(res).to.have.status([400]);
  });

  it('Should create the a multi city trip  Request while logged as Requester', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send(multiCityTripRequestAcc);
    expect(res).to.have.status([201]);
  });

  it('Should  not Update Trip request which has pending status while logged in user to multi city or vice versal with same accommodation id', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/trips/2`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send(multiCityTripRequest);

    expect(res).to.have.status([400]);
  });

  it('Should Update Trip request which has pending status while logged in user to multi city or vice versal ', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/trips/2`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send(multiCityTripRequestAcc);
    expect(res).to.have.status([200]);
  });

  it('Should not create the Trip without accommodation', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        depart_location_id: 2,

        tripDate: '2022-10-12',
        returnDate: '2023-12-10',
        reason: 'Tourism'
      });
    expect(res).to.have.status([400]);
  });

  it('should not create multi city with one destinations accommodation id invalid', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        depart_location_id: 2,
        arrival_location: [
          {
            accommodation_id: 400,
            days: 3
          }
        ],
        tripDate: '2022-10-12',
        returnDate: '2023-12-10',
        reason: 'Tourism'
      });
    expect(res).to.have.status([400]);
  });

  it('Should  find trip by id', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/trips/2`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send();

    expect(res).to.have.status([200]);
  });

  it('Should not find trip by id', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/trips/1000`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send();

    expect(res).to.have.status([400]);
  });
});
