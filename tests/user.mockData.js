/* eslint-disable import/prefer-default-export */
export const httpReq = (email) => ({
  user: {
    emails: [
      {
        value: email
      }
    ],
    name: {
      familyName: 'request',
      middleName: 'request',
      givenName: 'request'
    },
    photos: [{ value: 'whatever photo' }]
  }
});

export const httpRes = () => {
  const res = {
    json: (data) => {
      res.body = data;
      return res;
    },
    status: (data) => {
      res.status = data;
      return res;
    }
  };

  return res;
};
