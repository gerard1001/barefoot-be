import chai, { request, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import 'dotenv/config';
import UserController from '../src/controllers/user.controller';
import { httpReq, httpRes } from './user.mockData';

chai.use(chaiHttp);
describe('ASSIGNED USER TO MANAGER  END-POINT TEST', () => {
    describe('ASSIGNED USER TO MANAGER TEST', () => {
        let tok;
        before(async () => {
            const res = await chai.request(app).post('/api/v1/users/login').send({
                email: 'SUPER_ADMIN@gmail.com',
                password: 'SUPER_ADMIN2gmail'
            });

            tok = res.body.token;
        });
        it('should assigned user to manager', async () => {
            const res = await chai
                .request(app)
                .put(`/api/v1/users/assign-to-manager`)
                .set('Authorization', `Bearer ${tok}`)
                .send({ userId: 4, managerId: 3 });

            expect(res.status).to.be.equal(200);
        });
        it('No manager with such Id', async () => {
            const res = await chai
                .request(app)
                .put(`/api/v1/users/assign-to-manager`)
                .set('Authorization', `Bearer ${tok}`)
                .send({ userId: 1, managerId: 11 });
            expect(res.status).to.be.equal(400);
        });
        it('No user with such Id', async () => {
            const res = await chai
                .request(app)
                .put(`/api/v1/users/assign-to-manager`)
                .set('Authorization', `Bearer ${tok}`)
                .send({ userId: 20, managerId: 3 });

            expect(res.status).to.be.equal(400);
        });
        it('No authorization', async () => {
            const res = await chai
                .request(app)
                .put(`/api/v1/users/assign-to-manager`)
                .set('Authorization', `Bearer kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk`)
                .send({ userId: 20, managerId: 3 });

            expect(res.status).to.be.equal(401);
        });
        it('No authorization', async () => {
            const res = await chai
                .request(app)
                .put(`/api/v1/users/assign-to-manager`)
                .set('Authorization', `Bearer ${tok}`)
                .send({ userId: "bad message", managerId: 3 });

            expect(res.status).to.be.equal(500);
        });
    });
});