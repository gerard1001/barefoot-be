/* eslint-disable import/named */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import { getPagination } from '../src/utils/pagination.utils';
import accommodationValidation from '../src/validations/accommodation.validation';

chai.use(chaiHttp);

describe('test pagination', async () => {
  it('should test pagination', async () => {
    expect(getPagination).to.be.a('function');
  });

  it('accommodation should be a function', async () => {
    expect(accommodationValidation).to.be.a('function');
  });

  it('should test the return', async () => {
    expect(getPagination().newLimit).to.equal(10);
    expect(getPagination().offset).to.equal(0);
  });
});
