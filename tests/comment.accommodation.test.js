import chai, { expect, request } from 'chai';
import { stub, assert } from 'sinon';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import app from '../src/app';
import { userLogin } from './dammyData';
import accommodationService from '../src/services/accommodations.service';

chai.use(chaiHttp);

describe('ACCOMMODATION COMMENT TESTING', () => {
  let reqToken1;
  let reqToken2;
  let superToken;

  before(async () => {
    const data = await request(app).post('/api/v1/users/login').send(userLogin);
    reqToken1 = data.body.token;
  });
  before(async () => {
    const data = await request(app).post('/api/v1/users/login').send({
      email: 'REQUESTER1@gmail.com',
      password: 'REQUESTER2gmail'
    });
    reqToken2 = data.body.token;
  });
  before(async () => {
    const data = await request(app).post('/api/v1/users/login').send({
      email: 'SUPER_ADMIN@gmail.com',
      password: 'SUPER_ADMIN2gmail'
    });
    superToken = data.body.token;
  });

  describe('GET ACCOMMODATION COMMENT TEST', () => {
    it('should not retrieve all comments if database failed', async () => {
      const getAllComments = stub(
        accommodationService,
        'getAllComments'
      ).rejects(new Error('Database failed'));
      const res = await request(app).get('/api/v1/accommodations/1/comment');
      assert.called(getAllComments);
      expect(res.status).to.equal(500);
      getAllComments.restore();
    });

    it('should retrieve all comments', async () => {
      const res = await request(app).get('/api/v1/accommodations/1/comment');
      expect(res.status).to.equal(200);
    });
  });

  describe('CREATE ACCOMMODATION COMMENT TEST', () => {
    it('should not create a comment if database failed', async () => {
      const createComment = stub(accommodationService, 'createComment').rejects(
        new Error('database failed')
      );
      const res = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      assert.called(createComment);
      expect(res.status).to.equal(500);
      createComment.restore();
    });

    it('should not create a comment if he never had a trip at that accommodation', async () => {
      const res = await request(app)
        .post('/api/v1/accommodations/5/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      expect(res.status).to.equal(400);
    });

    it('should not create a comment if comment not a string', async () => {
      const res = await request(app)
        .post('/api/v1/accommodations/3/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 1 });
      expect(res.status).to.equal(400);
    });

    it("should not create a comment if accommodation id does't exist", async () => {
      const res = await request(app)
        .post('/api/v1/accommodations/10000/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      expect(res.status).to.equal(404);
    });

    it('should not create a comment if he never been at the accomodation atleast a day', async () => {
      const res = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken2}`)
        .send({ comment: 'comment' });
      expect(res.status).to.equal(400);
    });

    it('should create a comment', async () => {
      const res = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      expect(res.status).to.equal(201);
    });
  });

  describe('UPDATE ACCOMMODATION COMMENT TEST', () => {
    it('should not update a comment if database failed', async () => {
      const commentRes = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      const updateComment = stub(accommodationService, 'updateComment').rejects(
        new Error('database failed')
      );
      const res = await request(app)
        .put(`/api/v1/accommodations/1/comment/${commentRes.body.data.id}`)
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment UPDATED' });
      assert.called(updateComment);
      expect(res.status).to.equal(500);
      updateComment.restore();
    });

    it('should not update a comment if user is not the one who created it', async () => {
      const commentRes = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      const res = await request(app)
        .put(`/api/v1/accommodations/1/comment/${commentRes.body.data.id}`)
        .set('Authorization', `Bearer ${reqToken2}`)
        .send({ comment: 'comment UPDATED' });
      expect(res.status).to.equal(404);
    });

    it("should not update a comment if comment does't exist", async () => {
      const res = await request(app)
        .put(`/api/v1/accommodations/1/comment/1000`)
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment UPDATED' });
      expect(res.status).to.equal(404);
    });

    it('should update a comment if user is super admin', async () => {
      const commentRes = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      const res = await request(app)
        .put(`/api/v1/accommodations/1/comment/${commentRes.body.data.id}`)
        .set('Authorization', `Bearer ${superToken}`)
        .send({ comment: 'comment UPDATED' });
      expect(res.status).to.equal(200);
      expect(res.body.data.comment).to.equal('comment UPDATED');
    });

    it('should not update a comment if not belong to specific accommodation', async () => {
      const commentRes = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      const res = await request(app)
        .put(`/api/v1/accommodations/2/comment/${commentRes.body.data.id}`)
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment UPDATED' });
      expect(res.status).to.equal(400);
    });

    it('should update a comment', async () => {
      const commentRes = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      const res = await request(app)
        .put(`/api/v1/accommodations/1/comment/${commentRes.body.data.id}`)
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment UPDATED' });
      expect(res.status).to.equal(200);
      expect(res.body.data.comment).to.equal('comment UPDATED');
    });
  });

  describe('DELETE ACCOMMODATION COMMENT TEST', () => {
    it('should not delete a comment if database failed', async () => {
      const commentRes = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      const deleteComment = stub(accommodationService, 'deleteComment').rejects(
        new Error('Database failed')
      );
      const res = await request(app)
        .delete(`/api/v1/accommodations/1/comment/${commentRes.body.data.id}`)
        .set('Authorization', `Bearer ${reqToken1}`);
      assert.called(deleteComment);
      expect(res.status).to.equal(500);
      deleteComment.restore();
    });

    it('should delete a comment', async () => {
      const commentRes = await request(app)
        .post('/api/v1/accommodations/1/comment')
        .set('Authorization', `Bearer ${reqToken1}`)
        .send({ comment: 'comment' });
      const res = await request(app)
        .delete(`/api/v1/accommodations/1/comment/${commentRes.body.data.id}`)
        .set('Authorization', `Bearer ${reqToken1}`);
      expect(res.status).to.equal(200);
    });
  });
});
