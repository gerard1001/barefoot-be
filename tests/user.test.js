import chai, { request, expect } from 'chai';
import { assert, stub } from 'sinon';
import chaiHttp from 'chai-http';
import path from 'path';
import { User } from '../src/database/models';
import app from '../src/app';
import 'dotenv/config';
import UserController from '../src/controllers/user.controller';
import { httpReq, httpRes } from './user.mockData';
import UserService from '../src/services/user.service';
import { generateToken } from '../src/helpers/user.helpers';

chai.use(chaiHttp);
describe('USER END-POINT TEST', () => {
  // Testing catches
  describe('USER CONTROLLER CATCHES', () => {
    it('should not register user if email verification not sent', async () => {
      const createUser = stub(UserService.prototype, 'createUser').callsFake(
        () => Promise.reject(new Error('Database failed'))
      );
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: `T${new Date().getMilliseconds()}tsa2341@gmail.com`,
          password: 'Tsa2341gmail',
          first_name: 'user first_name',
          last_name: 'user last_name',
          location_id: 1
        });
      assert.called(createUser);
      expect(res).to.have.status([500]);
      createUser.restore();
    });

    it('should not validate user email id database failed', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: `REQUESTER@gmail.com`,
        password: 'REQUESTER2gmail'
      });
      const { token } = res.body;
      const getUserId = stub(UserService.prototype, 'getUserId').callsFake(() =>
        Promise.reject(new Error('Database failed'))
      );
      const valid = await request(app).get(
        `/api/v1/users/verify-email/${token}`
      );
      assert.called(getUserId);
      expect(valid).to.have.status([500]);
      getUserId.restore();
    });

    it('it should not login the user if database failed', async () => {
      const userLogin = stub(UserService.prototype, 'userLogin').rejects(
        new Error('Database failed')
      );
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'SUPER_ADMIN@gmail.com',
        password: 'SUPER_ADMIN2gmail'
      });
      assert.called(userLogin);
      expect(res).to.have.status(404);
      userLogin.restore();
    });

    it('Should not return a token if sign in by google used and database is failing', async () => {
      const getUser = stub(UserService.prototype, 'getUser').callsFake(() =>
        Promise.reject(new Error('Database failed'))
      );
      const data = await new UserController().googleLogin(
        httpReq('REQUESTER@gmail.com'),
        httpRes()
      );
      assert.called(getUser);
      expect(data.status).to.equal(500);
      getUser.restore();
    });

    it('Should not return a token if sign in by facebook used and database failed', async () => {
      const getUser = stub(UserService.prototype, 'getUser').callsFake(() =>
        Promise.reject(new Error('Database failed'))
      );
      const data = await new UserController().facebookLogin(
        httpReq('REQUESTER@gmail.com'),
        httpRes()
      );
      assert.called(getUser);
      expect(data.status).to.equal(500);
      getUser.restore();
    });

    it('should log out a user', async () => {
      const login = await chai.request(app).post('/api/v1/users/login').send({
        email: 'SUPER_ADMIN@gmail.com',
        password: 'SUPER_ADMIN2gmail'
      });
      const userLogout = stub(UserService.prototype, 'userLogout').callsFake(
        () => Promise.reject(new Error('Database failed'))
      );
      const res = await chai
        .request(app)
        .post(`/api/v1/users/logout`)
        .set('Authorization', `Bearer ${login.body.token}`);
      assert.called(userLogout);
      expect(res.status).to.be.equal(500);
      userLogout.restore();
    });
  });
  describe('REGISTER USER TEST', () => {
    it('should register a user and get a token', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: `T${new Date().getMilliseconds()}tsa2341@gmail.com`,
          password: 'Tsa2341gmail',
          first_name: 'user first_name',
          last_name: 'user last_name',
          location_id: 1
        });
      expect(res).to.have.status([201]);
    });
    it('should not register a user if location id is not found', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: `T${new Date().getMilliseconds()}tsa2341@gmail.com`,
          password: 'Tsa2341gmail',
          first_name: 'user first_name',
          last_name: 'user last_name',
          location_id: 100
        });
      expect(res).to.have.status([404]);
    });
    it('should not register a user if exist', async () => {
      const res = await request(app).post('/api/v1/users/register').send({
        email: 'REQUESTER@gmail.com',
        password: 'REQUESTER2gmail',
        first_name: 'user first_name',
        last_name: 'user last_name',
        location_id: 1
      });
      expect(res).to.have.status([409]);
    });

    it('should not register a user if no password', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: `${new Date().getMilliseconds()}Tsa23415@example.com`,
          first_name: 'user first_name',
          last_name: 'user last_name'
        });
      expect(res).to.have.status([400]);
    });
    it('should not register a user if password invalid', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: `${new Date().getMilliseconds()}Tsa23415@example.com`,
          password: 'df'
        });
      expect(res).to.have.status([400]);
    });
  });

  describe('VALIDATE USER TEST', () => {
    it('should validate user email', async () => {
      const token = generateToken({ id: 4 }, '1d');
      const valid = await request(app).get(
        `/api/v1/users/verify-email/${token}`
      );
      expect(valid).to.have.status([200]);
    });

    it('should not login when not verified', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'TESTER@gmail.com',
        password: 'TESTER1cabal'
      });
      expect(res.status).to.be.equal(400);
    });
  });

  describe('USER LOGIN', () => {
    it('it should login the user', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'SUPER_ADMIN@gmail.com',
        password: 'SUPER_ADMIN2gmail'
      });
      expect(res).to.have.status(201);
      expect(res.body).haveOwnProperty('token');
      expect(res.header).to.haveOwnProperty('authenticate');
    });
    it('it should not login if user is not in database', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'SUPER@gmail.com',
        password: 'SUPER_ADMIN2gmail'
      });
      expect(res).to.have.status(400);
      expect(res.body).to.haveOwnProperty('message');
    });
    it('should not login with invalid email', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'SUPER_ADMIN',
        password: 'SUPER_ADMIN2gmail'
      });
      expect(res.status).to.be.equal(400);
      expect(res.body).to.haveOwnProperty('message');
    });
    it('should not login with invalid password', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'SUPER_ADMIN@gmail.com',
        password: 'SUPER_ADMINgmail'
      });
      expect(res.status).to.be.equal(400);
      expect(res.body).to.haveOwnProperty('message');
    });
    it('should not login with wrong password', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'SUPER_ADMIN@gmail.com',
        password: 'SUPER_ADMIN2'
      });
      expect(res.status).to.be.equal(400);
      expect(res.body).to.haveOwnProperty('message');
    });
    it('should give an error on wrong route', async () => {
      const res = await request(app).post('/api/v1/users/log').send({
        email: 'alain@gmail.com',
        password: 'WORDPASS2'
      });
      expect(res.status).to.be.equal(404);
      expect(res).to.haveOwnProperty('text');
    });
  });

  describe('LOGIN WITH SOCIAL ACCOUNTS USER TEST', () => {
    it('Should hit the endpoint if sign in by google used', async () => {
      const res = await request(app).get('/api/v1/users/google/login');
      expect(res.status).to.equal(200);
      expect(res.text).to.not.equal(null);
    });
    it('Should hit the endpoint if sign in by facebook used', async () => {
      const res = await request(app).get('/api/v1/users/facebook/login');
      expect(res.status).to.equal(200);
      expect(res.text).to.not.equal(null);
    });
    // it('Should return a token if sign in by google used', async () => {
    //   const data = await new UserController().googleLogin(
    //     httpReq(`tsa23411@gmail.com`),
    //     httpRes()
    //   );
    //   expect(data.status).to.equal(200);
    //   expect(data.body).to.haveOwnProperty('token');
    // });
    // it('Should return a token if sign in by facebook used', async () => {
    //   const data = await new UserController().facebookLogin(
    //     httpReq(`tsa234112@gmail.com`),
    //     httpRes()
    //   );
    //   expect(data.status).to.equal(200);
    //   expect(data.body).to.haveOwnProperty('token');
    // });
    // it('Should return a token if sign in by google used and user registered', async () => {
    //   const data = await new UserController().googleLogin(
    //     httpReq('REQUESTER@gmail.com'),
    //     httpRes()
    //   );
    //   expect(data.status).to.equal(200);
    //   expect(data.body).to.haveOwnProperty('token');
    // });
    // it('Should return a token if sign in by facebook used and user registered', async () => {
    //   const data = await new UserController().facebookLogin(
    //     httpReq('REQUESTER@gmail.com'),
    //     httpRes()
    //   );
    //   expect(data.status).to.equal(200);
    //   expect(data.body).to.haveOwnProperty('token');
    // });
  });

  describe('USER-LOGOUT TEST', () => {
    let tok;
    before(async () => {
      const res = await chai.request(app).post('/api/v1/users/login').send({
        email: 'SUPER_ADMIN@gmail.com',
        password: 'SUPER_ADMIN2gmail'
      });

      tok = res.body.token;
    });
    it('should log out a user', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/logout`)
        .set('Authorization', `Bearer ${tok}`);

      expect(res.status).to.be.equal(200);
    });

    it('should not log out a user on wrong route', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/logouttt`)
        .set({ Authorization: `Bearer ${tok}` });

      expect(res.status).to.be.equal(404);
    });

    it('should not log out a user without access token', async () => {
      const res = await chai.request(app).post(`/api/v1/users/logout`);

      expect(res.status).to.be.equal(403);
    });

    it('should not log out a user with invalid access token', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/logout`)
        .set({ Authorization: `Bearer kkkkkkkkkkkkkkkkkk` });

      expect(res.status).to.be.equal(401);
    });
  });

  describe('USER PROFILE', () => {
    it('should update profile', async () => {
      const login = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'REQUESTER@gmail.com', password: 'REQUESTER2gmail' });
      const res = await request(app)
        .patch('/api/v1/users/profile')
        .set({ Authorization: `Bearer ${login.body.token}` })
        .set('content-type', 'multipart/form-data')
        .field('first_name', 'ishimwe')
        .field('last_name', 'gabin')
        .field('language', 'english')
        .field('gender', 'male')
        .field('occupation', 'technical engineer')
        .field('bio', 'i like travelling')
        .field('nationality', 'burundian')
        .field('location_id', 2)
        .attach(
          'profile_picture',
          path.join(__dirname, '/image/profile.png'),
          'profile.png'
        );
      expect(res.status).to.be.equal(200);
      expect(res.body.message).to.be.equal('Profile updated');
    });

    after(async () => {
      await User.destroy({
        where: {},
        truncated: true
      });
    });
  });
});
