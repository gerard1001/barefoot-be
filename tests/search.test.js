import app from '../src/app';
import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import path from 'path';

chai.use(chaiHttp);

describe('SEARCH END-POINT TESTING', () => {
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
  // ////
  it('it should retrive data based on user name', async () => {
    const res = await request(app)
      .get('/api/v1/search?owner=REQUESTER1')
      .set('authorization', `Bearer ${reqToken2}`);

    expect(res.status).to.equal(200);
  });

  it('it should not retrive data based on user name with wrong name', async () => {
    const res = await request(app)
      .get('/api/v1/search?owner=mike')
      .set('authorization', `Bearer ${reqToken}`);

    expect(res.status).to.equal(400);
  });

  it('it should not retrive data based on duration of trip if provided one date', async () => {
    const res = await request(app)
      .get('/api/v1/search?duration=2020-10-10')
      .set('authorization', `Bearer ${reqToken}`);

    expect(res.status).to.equal(400);
  });

  it('it should not retrive data based on duration of trip', async () => {
    const res = await request(app)
      .get('/api/v1/search?duration=2020-10-10&endDate=2023-10-10')
      .set('authorization', `Bearer ${reqToken}`);

    expect(res.status).to.equal(200);
  });

  it('it should retrive data based on status', async () => {
    const res = await request(app)
      .get('/api/v1/search?status=PENDING')
      .set('authorization', `Bearer ${reqToken}`);

    expect(res.status).to.equal(200);
  });

  it('it should retrive data based on destination', async () => {
    const res = await request(app)
      .get('/api/v1/search?destination=Kigali')
      .set('authorization', `Bearer ${reqToken}`);

    expect(res.status).to.equal(400);
  });

  it('it should not retrive data on wrong route', async () => {
    const res = await request(app)
      .get('/api/v1/sear?owner=REQUESTER')
      .set('authorization', `Bearer ${reqToken}`);

    expect(res.status).to.equal(404);
  });

  it('it should not retrive data when entries are not specified', async () => {
    const res = await request(app)
      .get('/api/v1/search?car=benz')
      .set('authorization', `Bearer ${reqToken}`);

    expect(res.status).to.equal(500);
  });

  it('it should not retrive data by user when users dont match', async () => {
    const res = await request(app)
      .get('/api/v1/search?owner=REQUESTER1')
      .set('authorization', `Bearer ${reqToken}`);

    expect(res.status).to.be.eq(400);
  });

  it('it should give you accessible data when no queries sent', async () => {
    const res = await request(app)
      .get('/api/v1/search')
      .set('authorization', `Bearer ${reqToken}`);

    expect(res.status).to.be.eq(200);
  });

  // /////////// MANAGER TESTS

  describe('MANAGER SEARCH', () => {
    it('it should retrive data based on user name', async () => {
      const res = await request(app)
        .get('/api/v1/search?owner=REQUESTER')
        .set('authorization', `Bearer ${manToken}`);

      expect(res.status).to.equal(200);
    });

    it('it should not retrive data based on user name with wrong name', async () => {
      const res = await request(app)
        .get('/api/v1/search?owner=mike')
        .set('authorization', `Bearer ${manToken}`);

      expect(res.status).to.equal(400);
    });

    it('it should not retrive data based on duration of trip if provided one date', async () => {
      const res = await request(app)
        .get('/api/v1/search?duration=2020-10-10')
        .set('authorization', `Bearer ${reqToken}`);

      expect(res.status).to.equal(400);
    });

    it('it should not retrive data based on duration of trip', async () => {
      const res = await request(app)
        .get('/api/v1/search?duration=2020-10-10&endDate=2023-10-10')
        .set('authorization', `Bearer ${reqToken}`);

      expect(res.status).to.equal(200);
    });

    it('it should retrive data based on status', async () => {
      const res = await request(app)
        .get('/api/v1/search?status=PENDING')
        .set('authorization', `Bearer ${manToken}`);

      expect(res.status).to.equal(200);
    });

    it('it should retrive data based on destination', async () => {
      const res = await request(app)
        .get('/api/v1/search?destination=Kigali')
        .set('authorization', `Bearer ${manToken}`);

      expect(res.status).to.equal(400);
    });

    it('it should not retrive data on wrong route', async () => {
      const res = await request(app)
        .get('/api/v1/sear?owner=REQUESTER')
        .set('authorization', `Bearer ${manToken}`);

      expect(res.status).to.equal(404);
    });

    it('it should not retrive data when entries are not specified', async () => {
      const res = await request(app)
        .get('/api/v1/search?car=benz')
        .set('authorization', `Bearer ${manToken}`);

      expect(res.status).to.equal(500);
    });

    it('it should give you accessible data when no queries sent', async () => {
      const res = await request(app)
        .get('/api/v1/search')
        .set('authorization', `Bearer ${manToken}`);

      expect(res.status).to.be.eq(200);
    });
  });

  /// ////////////// SUPER_ADMIN TESTS

  describe('SUPER_ADMIN SEARCH TESTS', () => {
    it('it should retrive data based on user name', async () => {
      const res = await request(app)
        .get('/api/v1/search?owner=REQUESTER')
        .set('authorization', `Bearer ${superToken}`);

      expect(res.status).to.equal(200);
    });

    it('it should not retrive data based on user name with wrong name', async () => {
      const res = await request(app)
        .get('/api/v1/search?owner=mike')
        .set('authorization', `Bearer ${superToken}`);

      expect(res.status).to.equal(400);
    });

    it('it should not retrive data based on duration of trip if provided one date', async () => {
      const res = await request(app)
        .get('/api/v1/search?duration=2020-10-10')
        .set('authorization', `Bearer ${reqToken}`);

      expect(res.status).to.equal(400);
    });

    it('it should not retrive data based on duration of trip', async () => {
      const res = await request(app)
        .get('/api/v1/search?duration=2020-10-10&endDate=2023-10-10')
        .set('authorization', `Bearer ${reqToken}`);

      expect(res.status).to.equal(200);
    });

    it('it should retrive data based on status', async () => {
      const res = await request(app)
        .get('/api/v1/search?status=PENDING')
        .set('authorization', `Bearer ${superToken}`);

      expect(res.status).to.equal(200);
    });

    it('it should retrive data based on destination', async () => {
      const res = await request(app)
        .get('/api/v1/search?destination=Kigali')
        .set('authorization', `Bearer ${superToken}`);

      expect(res.status).to.equal(400);
    });

    it('it should not retrive data on wrong route', async () => {
      const res = await request(app)
        .get('/api/v1/sear?owner=REQUESTER')
        .set('authorization', `Bearer ${superToken}`);

      expect(res.status).to.equal(404);
    });

    it('it should not retrive data when entries are not specified', async () => {
      const res = await request(app)
        .get('/api/v1/search?car=benz')
        .set('authorization', `Bearer ${superToken}`);

      expect(res.status).to.equal(500);
    });

    it('it should give you accessible data when no queries sent', async () => {
      const res = await request(app)
        .get('/api/v1/search')
        .set('authorization', `Bearer ${superToken}`);

      expect(res.status).to.be.eq(200);
    });
  });

  /// ///////// MIXED 2 QUERIES

  describe('MIXED 2 QUERIES', () => {
    it('it should retrieve data with 2 queries', async () => {
      const res = await request(app)
        .get('/api/v1/search?status=PENDING&destination=Kigali')
        .set('authorization', `Bearer ${reqToken}`);

      expect(res.status).to.equal(400);
    });

    it('it should retrieve data with 2 queries', async () => {
      const res = await request(app)
        .get(
          '/api/v1/search?status=PENDING&duration=2019-10-10&endDate=2024-10-10'
        )
        .set('authorization', `Bearer ${reqToken}`);

      expect(res.status).to.equal(200);
    });

    it('it should retrieve data with 2 queries', async () => {
      const res = await request(app)
        .get(
          '/api/v1/search?status=PENDING&duration=2019-10-10&endDate=2024-10-10'
        )
        .set('authorization', `Bearer ${manToken}`);

      expect(res.status).to.equal(200);
    });

    it('it should retrieve data with 2 queries', async () => {
      const res = await request(app)
        .get(
          '/api/v1/search?status=PENDING&duration=2019-10-10&endDate=2024-10-10'
        )
        .set('authorization', `Bearer ${superToken}`);

      expect(res.status).to.equal(200);
    });
  });

  /// /////// MIXED 3 QUERIES

  describe('MIXED 3 QUERIES', () => {
    it('it should retrieve data with 3 queries', async () => {
      const res = await request(app)
        .get(
          '/api/v1/search?status=PENDING&destination=Kigali&duration=2020-10-10&endDate=2024-10-10'
        )
        .set('authorization', `Bearer ${reqToken}`);

      expect(res.status).to.equal(400);
    });
    // //////////

    it('it should retrieve data with 3 queries', async () => {
      const res = await request(app)
        .get(
          '/api/v1/search?status=PENDING&duration=2019-10-10&endDate=2024-10-10&owner=REQUESTER1'
        )
        .set('authorization', `Bearer ${superToken}`);

      expect(res.status).to.equal(200);
    });
  });

  /// /////// MIXED 4 QUERIES  LOCATION

  describe('MIXED 4 QUERIES', () => {
    it('it should retrieve data with 4 queries', async () => {
      const res = await request(app)
        .get(
          '/api/v1/search?status=PENDING&destination=Kigali&duration=2020-10-10&endDate=2024-10-10&owner=REQUESTER'
        )
        .set('authorization', `Bearer ${reqToken}`);

      expect(res.status).to.equal(400);
    });

    it('it should retrieve data with 4 queries', async () => {
      const res = await request(app)
        .get(
          '/api/v1/search?status=PENDING&duration=2019-10-10&endDate=2024-10-10&owner=REQUESTER&destination=Kigali'
        )
        .set('authorization', `Bearer ${manToken}`);

      expect(res.status).to.equal(400);
    });
  });
});
