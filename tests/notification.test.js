import chai, { request, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import 'dotenv/config';
chai.use(chaiHttp);
describe(' GETTING ALL NOTIFICATION TEST', () => {
    describe('Users should be able to get all notifications  TEST', () => {
        let tok, toks;
        before(async() => {
            const res = await chai.request(app).post('/api/v1/users/login').send({
                email: 'TRAVEL_ADMIN@gmail.com',
                password: 'TRAVEL_ADMIN2gmail'
            });

            tok = res.body.token;
        });
        before(async() => {
            const res = await chai.request(app).post('/api/v1/users/login').send({
                email: 'gabinishimwe02@gmail.com',
                password: 'MANAGER2gmail'
            });

            toks = res.body.token;
        });
        it('get all notification', async() => {
            const res = await chai
                .request(app)
                .get(`/api/v1/notifications/`)
                .set('Authorization', `Bearer ${tok}`)
                .send()
            expect(res.status).to.be.equal(200);
        });
        it('notification not found', async() => {
            const res = await chai
                .request(app)
                .get(`/api/v1/notifications/`)
                .set('Authorization', `Bearer ${toks}`)
            expect(res.status).to.be.equal(400);
        });
    });
});


describe(' MARK ONE NOTIFICATION AS READ TEST', () => {
    describe('Users should be able to mark ONE notifications as read TEST', () => {
        let tok, toks;
        before(async() => {
            const res = await chai.request(app).post('/api/v1/users/login').send({
                email: 'TRAVEL_ADMIN@gmail.com',
                password: 'TRAVEL_ADMIN2gmail'
            });

            tok = res.body.token;
        });
        it('mark ONE notifications as read', async() => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/notifications/1`)
                .set('Authorization', `Bearer ${tok}`)
                .send()
            expect(res.status).to.be.equal(200);
        });
        it('Notification is already marked', async() => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/notifications/1`)
                .set('Authorization', `Bearer ${tok}`)
                .send()
            expect(res.status).to.be.equal(400);
        });
        it('No notification you have', async() => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/notifications/112`)
                .set('Authorization', `Bearer ${tok}`)
                .send({});
            expect(res.status).to.be.equal(400);
        });
    });
});



describe(' MARK ALL NOTIFICATION AS READ TEST', () => {
    describe('Users should be able to mark all notifications as read TEST', () => {
        let tok, toks;
        before(async() => {
            const res = await chai.request(app).post('/api/v1/users/login').send({
                email: 'TRAVEL_ADMIN@gmail.com',
                password: 'TRAVEL_ADMIN2gmail'
            });

            tok = res.body.token;
        });
        before(async() => {
            const res = await chai.request(app).post('/api/v1/users/login').send({
                email: 'REQUESTER@gmail.com',
                password: 'REQUESTER2gmail'
            });

            toks = res.body.token;
        });
        before(async() => {
            const res = await chai.request(app).post('/api/v1/users/login').send({
                email: 'gabinishimwe02@gmail.com',
                password: 'MANAGER2gmail'
            });

            toks = res.body.token;
        });
        it('mark all notifications as read', async() => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/notifications`)
                .send({})
                .set('Authorization', `Bearer ${tok}`)
            expect(res.status).to.be.equal(200);
        });
        it('No mark all notification you have', async() => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/notifications`)
                .set('Authorization', `Bearer ${toks}`)
                .send({});
            expect(res.status).to.be.equal(400);
        });
    });
});