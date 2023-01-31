import client from "socket.io-client"
import chaiHttp from "chai-http"
import chai, { expect, request } from "chai"
import { io, users } from "../src/utils/socket.utils"
import app from "../src/app"
import { userLogin } from "./dammyData"

chai.use(chaiHttp)

describe("in app notification test", () => {
    let clientSocket, serverClient;
    before(async() => {
        serverClient = request(app).keepOpen();
        const userLogin = await serverClient.post("/api/v1/users/login").send({
            email: "MANAGER@gmail.com",
            password: "MANAGER2gmail"
        })
        const { port } = app.address();
        clientSocket = client.connect(`http://localhost:${port}`, {
            forceNew: true,
            auth: {
                token: userLogin.body.token
            }
        });
    });
    after(() => {
        io.close();
        clientSocket.close();
        serverClient.close();
    });

    describe("checking socket io connection", () => {
        it("should listen for notification", (done) => {
            clientSocket.on("connect", () => {
                clientSocket.on("notification", (arg) => {
                    expect(arg).to.equal("testing notification");
                    done();
                });
                io.emit("notification", "testing notification")
            })

        })
    })

})