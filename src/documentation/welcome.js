import responses from "./response";

const welcome = {
  "/home": {
    get: {
      responses,
    },
  },
};
export default welcome;
