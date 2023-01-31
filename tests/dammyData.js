/* eslint-disable import/prefer-default-export */
export const tripRequest = {
  depart_location_id: 2,
  arrivalLocations: [
    {
      accommodation_id: 1,
      days: 2
    },
    {
      accommodation_id: 2,
      days: 1
    }
  ],

  tripDate: '2022-10-12',
  returnDate: '2023-12-10',
  reason: 'Tourism'
};
export const userLogin = {
  email: 'REQUESTER@gmail.com',
  password: 'REQUESTER2gmail'
};
export const checkValidation = {
  originCity: 'Kigali',
  destination: 'Nyarugenge',
  tripDate: '2022-13-12',
  returnDate: '2023-12-10',
  accommodationId: 2,
  multiCityTripId: 0,
  reason: 'Tourism',
  status: 'pending'
};
export const comments = {
  user_id: 4,
  trip_id: 2,
  comment: 'this shold be working here'
};
export const commentsDifferentUserId = {
  user_id: 3,
  trip_id: 2,
  comment: 'this shold be working here'
};

export const tripApprove = {
  depart_location_id: 2,
  accommodation_id: 1,
  tripDate: '2022-10-12',
  returnDate: '2023-12-10',
  reason: 'Tourism',
  status: 'PENDING'
};

export const accommodation = {
  name: 'Marriot Hotel',
  description:
    'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .',
  location_id: 13,
  services: ['restaurant', 'breakfast', 'gym', 'swimming pool'],
  amenities: ['restaurant', 'breakfast', 'gym', 'swimming pool'],
  images: [
    'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  ],
  imagesId: ['456780rty']
};

export const accommodationLocation = {
  name: 'Marriot Hotel',
  description:
    'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .',
  location_id: 119,
  services: ['restaurant', 'breakfast', 'gym', 'swimming pool'],
  amenities: ['restaurant', 'breakfast', 'gym', 'swimming pool'],
  images: [
    'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  ],
  imagesId: ['456780rty']
};

export const accommodationInternalServer = {
  name: 'Marriot Hotel',
  description:
    'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying .',
  location_id: 15,
  services: ['restaurant', 'breakfast', 'gym', 'swimming pool'],
  amenities: ['restaurant', 'breakfast', 'gym', 'swimming pool'],
  images: [
    'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  ],
  imagesId: ['456780rty']
};

export const multiCityTripRequest = {
  arrivalLocations: [
    {
      accommodation_id: 1,
      days: 3
    },
    {
      accommodation_id: 1,
      days: 3
    }
  ],
  depart_location_id: 2,

  tripDate: '2022-10-12',
  returnDate: '2023-12-10',
  reason: 'Tourism'
};

export const multiCityTripRequestAcc = {
  arrivalLocations: [
    {
      accommodation_id: 1,
      days: 3
    },
    {
      accommodation_id: 2,
      days: 3
    }
  ],
  depart_location_id: 2,

  tripDate: '2022-10-12',
  returnDate: '2023-12-10',
  reason: 'Tourism'
};
