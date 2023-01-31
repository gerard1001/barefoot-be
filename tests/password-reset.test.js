import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import 'dotenv/config';
import { generateToken } from '../src/helpers/user.helpers';

chai.use(chaiHttp);

describe('TESTING PASSWORD RESET', () => {
  after((done) => {
    chai
      .request(app)
      .patch(`/api/v1/users/reset-password/${generateToken({ id: 1 }, '10m')}`)
      .send({ password: 'SUPER_ADMIN2gmail' })
      .end((err, res) => {
        expect(res).to.have.status([200]);
        done();
      });
  });

  it('should not reset password for invalid email', (done) => {
    chai
      .request(app)
      .post(`/api/v1/users/forgot-password`)
      .send({ email: 'invalid@gmail.com' })
      .end((err, res) => {
        expect(res).to.have.status([404]);
        done();
      });
  });
  it('should Send password reset link', (done) => {
    chai
      .request(app)
      .post(`/api/v1/users/forgot-password`)
      .send({ email: 's.ishimwegabin@gmail.com' })
      .end((err, res) => {
        expect(res).to.have.status([200]);
        done();
      });
  });

  it('should Send password reset link with invalid email', (done) => {
    chai
      .request(app)
      .post(`/api/v1/users/forgot-password`)
      .send({ email: 'SUPER@gmail.com' })
      .end((err, res) => {
        expect(res).to.have.status([404]);
        done();
      });
  });
  it('should reset password', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/users/reset-password/${generateToken({ id: 1 }, '10m')}`)
      .send({ password: 'Password12' })
      .end((err, res) => {
        expect(res).to.have.status([200]);
        done();
      });
  });
  it('should reset not  password', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/users/reset-password/:token`)
      .send({ password: '4assword' })
      .end((err, res) => {
        expect(res).to.have.status([400]);
        done();
      });
  });
  it('should reset not  password', (done) => {
    chai
      .request(app)
      .patch(
        `/api/v1/users/reset-password/eyJhbGciO.k8jHrhjRJXymilhpotQTVjhxhF4_4jziU2w1tHTh3WA`
      )
      .send({ password: 'Password12' })
      .end((err, res) => {
        expect(res).to.have.status([500]);
        done();
      });
  });
});
