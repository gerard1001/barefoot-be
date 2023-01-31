import chaiHttp from 'chai-http';
import chai, { request, expect } from 'chai';
import { io as Client } from 'socket.io-client';
import server from '../src/app';
import { io } from '../src/utils/socket.utils';
import 'dotenv/config';

chai.use(chaiHttp);

describe('CHAT BOT TESTING', () => {
  let clientSocket, serverClient;
  before(async () => {
    serverClient = request(server).keepOpen();
    const login = await serverClient.post('/api/v1/users/login').send({
      email: 'REQUESTER@gmail.com',
      password: 'REQUESTER2gmail'
    });

    const { port } = server.address();
    clientSocket = Client.connect(`http://localhost:${port}`, {
      forceNew: true,
      auth: { token: login.body.token }
    });
  });

  after(async () => {
    io.close();
    clientSocket.close();
    serverClient.close();
  });

  it('should send a message to everyone', (done) => {
    clientSocket.on('connect', () => {});
    clientSocket.on('connect_error', (error) => {});
    clientSocket.emit('online', {});
    clientSocket.on('user:online', () => {
      clientSocket.emit('message:send', { message: 'testing' });
    });
    clientSocket.on('message:recieve', (data1) => {
      expect(data1.message.message).to.equal('testing');
      expect(data1).to.not.equal(null);
      done();
    });
  });
});
