import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import 'dotenv/config';

chai.use(chaiHttp);

describe('HOME END-POINT TEST', () => {
  it('Should display welcome', (done) => {
    chai
      .request(app)
      .get(`/api/v1/home`)
      .send()
      .end((err, res) => {
        expect(res).to.have.status([200]);
        done();
      });
  });

  it('Should not display welcome', (done) => {
    chai
      .request(app)
      .get(`/api/v1/homee`)
      .send()
      .end((err, res) => {
        expect(res).to.have.status([404]);
        done();
      });
  });

  it('Should display a welcome  message', (done) => {
    chai
      .request(app)
      .get(`/`)
      .end((err, res) => {
        expect(res).to.have.status([200]);
        expect(res.body.message).to.equal('Welcome to Barefoot Nomad.');
        done();
      });
  });
});
