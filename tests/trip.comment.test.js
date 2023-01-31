import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import { assert, stub } from 'sinon';
import app from '../src/app';
import tripCommentsServices from '../src/services/trip.comments.service';
import { comments, commentsDifferentUserId } from './dammyData';

chai.use(chaiHttp);

describe('TRIP COMMENTS TESTING', () => {
  let reqToken;
  before(async () => {
    const login = await chai
      .request(app)
      .post('/api/v1/users/login')
      .send({ email: 'REQUESTER@gmail.com', password: 'REQUESTER2gmail' });

    reqToken = login.body.token;
  });
  it('should not comment on a trip if a user is not loggedIn', async () => {
    const res = await chai.request(app).post(`/api/v1/trips/2/comment`).send({
      comment: 'this is for testing this comment'
    });
    expect(res.status).to.be.equal(403);
  });

  it('should not create a comment if there is a field missing', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/trips/2/comment`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: ''
      });
    expect(res.status).to.be.equal(400);
  });

  it('should create a comment after a user is loggedIn and not assigned a trip', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/trips/3/comment`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome'
      });
    expect(res.status).to.be.equal(400);
  });

  it('should create a comment after a user is loggedIn', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/trips/1/comment`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome'
      });
    expect(res.status).to.be.equal(201);
  });

  it('should not create a comment if trip id doesnt exist', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/trips/100/comment`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome'
      });
    expect(res.status).to.be.equal(404);
  });

  it('should throw an error while creating a comment after a user is loggedIn', async () => {
    const createComment = stub(tripCommentsServices, 'createComment').rejects(
      new Error('database failed')
    );
    const res = await chai
      .request(app)
      .post(`/api/v1/trips/1/comment`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome'
      });
    assert.calledOnce(createComment);
    expect(res.status).to.be.equal(500);
    createComment.restore();
  });

  it('should find all comments assigned to a specific trip', async () => {
    const res = await chai.request(app).get('/api/v1/trips/2/comment');
    expect(res.status).to.equal(200);
  });

  it('should not edit a comment if not loggedIn', async () => {
    const comment = await tripCommentsServices.createComment(comments);
    comment.save();
    const res = await chai
      .request(app)
      .patch(`/api/v1/trips/2/comment/${comment.dataValues.id}`)
      .send({
        comment: 'the trip was awesome'
      });
    expect(res.status).to.be.equal(403);
  });

  it('should not edit a comment if user id is different', async () => {
    const comment = await tripCommentsServices.createComment(
      commentsDifferentUserId
    );
    comment.save();
    const res = await chai
      .request(app)
      .patch(`/api/v1/trips/2/comment/${comment.dataValues.id}`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome'
      });
    expect(res.status).to.be.equal(409);
  });
  it('should not edit a comment if user is loggedIn is not assigned a trip', async () => {
    const comment = await tripCommentsServices.createComment(comments);
    comment.save();
    const res = await chai
      .request(app)
      .patch(`/api/v1/trips/3/comment/${comment.dataValues.id}`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome updated'
      });
    expect(res.status).to.be.equal(409);
  });

  it('should edit a comment if a user is loggedIn', async () => {
    const comment = await tripCommentsServices.createComment(comments);
    comment.save();
    const res = await chai
      .request(app)
      .patch(`/api/v1/trips/1/comment/${comment.dataValues.id}`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome updated'
      });
    expect(res.status).to.be.equal(200);
  });

  it('should throw an error while editing a comment after a user is loggedIn', async () => {
    const editComment = stub(tripCommentsServices, 'editComment').rejects(
      new Error('database failed')
    );
    const comment = await tripCommentsServices.createComment(comments);
    comment.save();
    const res = await chai
      .request(app)
      .patch(`/api/v1/trips/1/comment/${comment.dataValues.id}`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome updated'
      });
    assert.calledOnce(editComment);
    expect(res.status).to.be.equal(500);
    editComment.restore();
  });

  it('should not delete a comment if you are not loggedIn', async () => {
    const comment = await tripCommentsServices.createComment(comments);
    comment.save();
    const res = await chai
      .request(app)
      .delete(`/api/v1/trips/2/comment/${comment.dataValues.id}`)
      .send({
        comment: 'the trip was awesome updated'
      });
    expect(res.status).to.be.equal(403);
  });

  it('should not delete a comment if a userId is diferent', async () => {
    const comment = await tripCommentsServices.createComment(
      commentsDifferentUserId
    );
    comment.save();
    const res = await chai
      .request(app)
      .delete(`/api/v1/trips/1/comment/${comment.dataValues.id}`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome updated'
      });
    expect(res.status).to.be.equal(400);
  });

  it('should not delete a comment id a user is loggedIn and not assigned a trip', async () => {
    const comment = await tripCommentsServices.createComment(comments);
    comment.save();
    const res = await chai
      .request(app)
      .delete(`/api/v1/trips/3/comment/${comment.dataValues.id}`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome updated'
      });
    expect(res.status).to.be.equal(409);
  });
  it('should delete a comment id a user is loggedIn', async () => {
    const comment = await tripCommentsServices.createComment(comments);
    comment.save();
    const res = await chai
      .request(app)
      .delete(`/api/v1/trips/1/comment/${comment.dataValues.id}`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome updated'
      });
    expect(res.status).to.be.equal(200);
  });

  it('should throw an error while deleting a comment after a user is loggedIn', async () => {
    const deleteComment = stub(tripCommentsServices, 'removeComment').rejects(
      new Error('database failed')
    );
    const comment = await tripCommentsServices.createComment(comments);
    comment.save();
    const res = await chai
      .request(app)
      .delete(`/api/v1/trips/1/comment/${comment.dataValues.id}`)
      .set('Authorization', `Bearer ${reqToken}`)
      .send({
        comment: 'the trip was awesome updated'
      });

    assert.calledOnce(deleteComment);
    expect(res.status).to.be.equal(500);
    deleteComment.restore();
  });
});
