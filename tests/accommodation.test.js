import chai, { expect } from 'chai';
import { stub, assert } from 'sinon';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import path from 'path';
import app from '../src/app';
import accommodationService from '../src/services/accommodations.service';
import accommodatonData from './mock/accommodation.mock';

chai.use(chaiHttp);

const { createAccommodation } = accommodationService;

describe('ACCOMMODATION ENDPOINT TESTING', () => {
  // eslint-disable-next-line no-unused-vars
  let travelToken, reqToken;
  before(async () => {
    const res = await chai.request(app).post('/api/v1/users/login').send({
      email: `TRAVEL_ADMIN@gmail.com`,
      password: 'TRAVEL_ADMIN2gmail'
    });

    travelToken = res.body.token;
  });
  before(async () => {
    const res = await chai.request(app).post('/api/v1/users/login').send({
      email: `REQUESTER@gmail.com`,
      password: 'REQUESTER2gmail'
    });

    reqToken = res.body.token;
  });

  describe('RATE ACCOMMODATION TEST', () => {
    it('should not rate an accommodation database failed', async () => {
      const rateAccommodation = stub(
        accommodationService,
        'rateAccommodation'
      ).rejects(new Error('Database failed'));
      const res = await chai
        .request(app)
        .put('/api/v1/accommodations/1/rate')
        .set('Authorization', `Bearer ${reqToken}`)
        .send({ rate: 1 });
      assert.called(rateAccommodation);
      expect(res.status).to.equal(500);
      rateAccommodation.restore();
    });
    it('should not rate an accommodation if not logged in', async () => {
      const res = await chai
        .request(app)
        .put('/api/v1/accommodations/1/rate')
        .send({ rate: 1 });
      expect(res.status).to.equal(403);
    });
    it("should not rate an accommodation accommodation does't exist", async () => {
      const res = await chai
        .request(app)
        .put('/api/v1/accommodations/10000/rate')
        .set('Authorization', `Bearer ${reqToken}`)
        .send({ rate: 1 });
      expect(res.status).to.equal(404);
    });
    it('should not rate an accommodation if rate is below 1', async () => {
      const res = await chai
        .request(app)
        .put('/api/v1/accommodations/1/rate')
        .set('Authorization', `Bearer ${reqToken}`)
        .send({ rate: 0 });
      expect(res.status).to.equal(400);
    });
    it("should not rate an accommodation if haven't spent atlest a day at it", async () => {
      const res = await chai
        .request(app)
        .put('/api/v1/accommodations/2/rate')
        .set('Authorization', `Bearer ${reqToken}`)
        .send({ rate: 1 });
      expect(res.status).to.equal(400);
    });
    it('should rate an accommodation if logged in', async () => {
      const res = await chai
        .request(app)
        .put('/api/v1/accommodations/1/rate')
        .set('Authorization', `Bearer ${reqToken}`)
        .send({ rate: 1 });
      expect(res.status).to.equal(200);
    });
    it('should update rate of an accommodation if logged in', async () => {
      const res = await chai
        .request(app)
        .put('/api/v1/accommodations/3/rate')
        .set('Authorization', `Bearer ${reqToken}`)
        .send({ rate: 5 });
      expect(res.status).to.equal(200);
    });
  });

  it('should like an accomodation when logged in', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations/1/like')
      .set('authorization', `Bearer ${travelToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.data.like).to.equal(true);
  });

  it('should remove like on an accomodation when logged in', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations/1/like')
      .set('authorization', `Bearer ${travelToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.data.like).to.equal(null);
  });

  it('should add like on an accomodation if previouslly removed it when logged in', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations/1/like')
      .set('authorization', `Bearer ${travelToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.data.like).to.equal(true);
  });

  it('should not like an accomodation if not exist', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations/100000/unlike')
      .set('authorization', `Bearer ${travelToken}`);
    expect(res.status).to.equal(404);
  });

  it('should not like an accomodation if database failed ', async () => {
    const createLike = stub(accommodationService, 'createLike').rejects(
      new Error('databse failed')
    );
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations/1/like')
      .set('authorization', `Bearer ${travelToken}`);
    assert.called(createLike);
    expect(res.status).to.equal(500);
    createLike.restore();
  });

  it('should not create an accommodation if loggedIn user is not a travel admin', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', data.token)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      )
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location', 'Kigal-Rwanda')
      .field('latitude', '232436458765')
      .field('longitude', '45678998765')
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool']);
    expect(res.status).to.be.equal(403);
  });

  it('should not  create an accommodation if there is a field missing', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', data.token)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      )
      .field('name', '')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 1)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool']);
    expect(res.status).to.be.equal(400);
  });

  it('should not  create an accommodation if there is a if amenities is not an array', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', data.token)
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 1)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(200);
  });
  it('should not  create an accommodation if there is a if no file to upload', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', data.token)
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 1)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(400);
  });

  it('should not create an accommodation if location Id are the same and accommodation name', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', data.token)
      .attach(
        'images',
        path.join(__dirname, '/image/profile.png'),
        'weatherApp.png'
      )
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 1)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool']);

    const res = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', data.token)
      .attach(
        'images',
        path.join(__dirname, '/image/profile.png'),
        'weatherApp.png'
      )
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 1)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool']);
    expect(res.status).to.be.equal(400);
  });

  it('should send an internal server error while creating an accommodation', async () => {
    const accommodationCreated = stub(
      accommodationService,
      'createAccommodation'
    ).rejects(new Error('database failed'));
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', data.token)
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 12)
      .field('services', 'restaurant')
      .field('amenities', 'restaurant')
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    assert.calledOnce(accommodationCreated);
    expect(res.status).to.be.equal(500);
    accommodationCreated.restore();
  });

  it('should create an accommodation', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    await chai.request(app).get('/api/v1/accommodations');
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', data.token)
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 12)
      .field('services', 'restaurant')
      .field('amenities', 'restaurant')
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    expect(res.status).to.be.equal(200);
  });

  it('should find all accommodations', async () => {
    const accommodations = await createAccommodation(accommodatonData);
    accommodations.save();
    const res = await chai.request(app).get('/api/v1/accommodations');
    expect(res.status).to.be.equal(200);
  });

  it('should send an internal server error while gettiing all accommodations', async () => {
    const findAccommodations = stub(
      accommodationService,
      'findAllAccommodations'
    ).rejects(new Error('database failed'));
    const accommodations = await createAccommodation(accommodatonData);
    accommodations.save();
    const res = await chai.request(app).get('/api/v1/accommodations');
    assert.calledOnce(findAccommodations);
    expect(res.status).to.be.equal(500);
    findAccommodations.restore();
  });

  it('should get a specific accommodation', async () => {
    const accommodations = await createAccommodation(accommodatonData);
    accommodations.save();
    const res = await chai
      .request(app)
      .get(`/api/v1/accommodations/${accommodations.dataValues.id}`);
    expect(res.status).to.be.equal(200);
  });

  it('should not update an accommodation if user not logged in', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Content-Type', 'multipart/form-data')
      .attach(
        'image',
        path.join(__dirname, '/image/profile.png'),
        'weatherApp.png'
      )
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location', 'Kigal-Rwanda')
      .field('latitude', '232436458765')
      .field('longitude', '45678998765')
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('user_id', 1);
    expect(res.status).to.be.equal(403);
  });

  it('should not update an accommodation if loggedIn user is not a travel admin', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const res = await chai
      .request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', data.token)
      .attach(
        'images',
        path.join(__dirname, '/image/profile.png'),
        'weatherApp.png'
      )
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 12)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool']);
    expect(res.status).to.be.equal(403);
  });

  it('should update an accommodation', async () => {
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
      .field('location_id', 13)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      );
    const res = await chai
      .request(app)
      .put(`/api/v1/accommodations/${res1.body.data.id}`)
      .set('Authorization', data.token)
      .attach(
        'images',
        path.join(__dirname, 'weatherApp.PNG'),
        'weatherApp.png'
      )
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 13)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool']);
    expect(res.body).to.have.property('message');
    expect(res.status).to.be.equal(200);
  });

  it('should throw internal server error while updating an accommodation', async () => {
    const updateAcc = stub(
      accommodationService,
      'updateSpecificAccommodation'
    ).rejects(new Error('database failed'));
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
      .attach(
        'images',
        path.join(__dirname, '/image/profile.png'),
        'weatherApp.png'
      )
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 18)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool']);
    const res = await chai
      .request(app)
      .put(`/api/v1/accommodations/${res1.body.data.id}`)
      .set('Authorization', data.token)
      .attach(
        'images',
        path.join(__dirname, '/image/profile.png'),
        'weatherApp.png'
      )
      .field('name', 'Mariot Hotel')
      .field(
        'description',
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .'
      )
      .field('location_id', 18)
      .field('services', ['restaurant', 'breakfast', 'gym', 'swimming pool'])
      .field('amenities', ['restaurant', 'breakfast', 'gym', 'swimming pool']);
    assert.calledOnce(updateAcc);
    expect(res.body).to.have.property('message');
    expect(res.status).to.be.equal(500);
    updateAcc.restore();
  });

  it('should not delete an accommodation if a user is not loggedIn', async () => {
    const accommodations = await createAccommodation(accommodatonData);
    accommodations.save();
    const res = await chai
      .request(app)
      .delete(`/api/v1/accommodations/${accommodations.dataValues.id}`);
    expect(res.status).to.be.equal(403);
    expect(res.body).to.have.property('message');
  });

  it('should not delete an accommodation if loggedIn user is not Travel Admin', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const accommodations = await createAccommodation(accommodatonData);
    accommodations.save();
    const res = await chai
      .request(app)
      .delete(`/api/v1/accommodations/${accommodations.dataValues.id}`)
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(403);
    expect(res.body).to.have.property('message');
  });

  it('should delete an accommodation', async () => {
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const accommodations = await createAccommodation(accommodatonData);
    accommodations.save();
    const res = await chai
      .request(app)
      .delete(`/api/v1/accommodations/${accommodations.dataValues.id}`)
      .set('Authorization', data.token);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('message');
  });

  it('should throw an error while deleting delete an accommodation', async () => {
    const accommodationDelete = stub(
      accommodationService,
      'destroyAccommodation'
    ).rejects(new Error('database failed'));
    const logIn = await chai.request(app).post('/api/v1/users/login').send({
      email: 'TRAVEL_ADMIN@gmail.com',
      password: 'TRAVEL_ADMIN2gmail'
    });
    const data = {
      token: `Bearer ${logIn.body.token}`
    };
    const accommodations = await createAccommodation(accommodatonData);
    accommodations.save();
    const res = await chai
      .request(app)
      .delete(`/api/v1/accommodations/${accommodations.dataValues.id}`)
      .set('Authorization', data.token);
    assert.calledOnce(accommodationDelete);
    expect(res.status).to.be.equal(500);
    expect(res.body).to.have.property('message');
    accommodationDelete.restore();
  });
});
