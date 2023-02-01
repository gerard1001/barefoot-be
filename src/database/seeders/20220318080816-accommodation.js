module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('Accommodations', [
      {
        name: 'Serena Hotel',
        description:
          'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.',
        location_id: 2,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1559138803-bcdd7e9a2176?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=375&q=80',
          'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
          'https://images.unsplash.com/photo-1606004898841-706417f4e7e3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1787&q=80'
        ]),
        imagesId: JSON.stringify([
          '234567890ertyuio',
          '34567890-wertyui',
          '234567890wertyui'
        ]),
        services: JSON.stringify([
          'restaurant',
          'breakfast',
          'gym',
          'swimming pool'
        ]),
        user_id: 2,
        amenities: JSON.stringify(
          JSON.stringify([
            '5 star hotel with swimming pool and gym',
            'And yes we have the best cookies'
          ])
        ),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Galaxy Hotel',
        description:
          'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.',
        location_id: 2,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1576801582643-c4e3d33efd2e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          'https://images.unsplash.com/photo-1576801582643-c4e3d33efd2e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'
        ]),
        imagesId: JSON.stringify([
          '234567890ertyuio',
          '34567890-wertyui',
          '234567890wertyui'
        ]),
        services: JSON.stringify([
          'restaurant',
          'breakfast',
          'gym',
          'swimming pool'
        ]),
        user_id: 9,
        amenities: JSON.stringify([
          '5 star hotel with swimming pool and gym',
          'And yes we have the best cookies'
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Muhazi Hotel',
        description:
          'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.',
        location_id: 1,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1601780298271-b04074de49df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1519449556851-5720b33024e7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        ]),
        imagesId: JSON.stringify([
          '234567890ertyuio',
          '34567890-wertyui',
          '234567890wertyui'
        ]),
        services: JSON.stringify([
          'restaurant',
          'breakfast',
          'gym',
          'swimming pool'
        ]),
        user_id: 9,
        amenities: JSON.stringify([
          '5 star hotel with swimming pool and gym',
          'And yes we have the best cookies'
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'kigali Hotel',
        description:
          'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.',
        location_id: 2,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1548107121-ba49955415b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80',
          'https://images.unsplash.com/photo-1462539405390-d0bdb635c7d1?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdGVsfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        ]),
        imagesId: JSON.stringify([
          '234567890ertyuio',
          '34567890-wertyui',
          '234567890wertyui'
        ]),
        services: JSON.stringify([
          'restaurant',
          'breakfast',
          'gym',
          'swimming pool'
        ]),
        user_id: 9,
        amenities: JSON.stringify([
          '5 star hotel with swimming pool and gym',
          'And yes we have the best cookies'
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),
  down: (queryInterface) =>
    queryInterface.bulkDelete('Accommodations', null, {})
};
