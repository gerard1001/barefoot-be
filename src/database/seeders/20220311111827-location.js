module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('Locations', [
      {
        name: 'Kigali',
        description: 'Down Town',
        country: 'Rwanda',
        longitude: 345678,
        latitude: 345678,
        visitCount: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lagos',
        description: 'Business Town',
        country: 'Nigeria',
        longitude: 345678,
        latitude: 345678,
        visitCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'New York',
        description: 'UN sideport',
        country: 'USA',
        longitude: 345678,
        latitude: 345678,
        visitCount: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rio Ave',
        description: 'South America',
        country: 'Mexico',
        longitude: 345678,
        latitude: 345678,
        visitCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dubai',
        description: 'The home of business',
        country: 'UAE',
        longitude: 345678,
        latitude: 345678,
        visitCount: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('Locations', null, {})
};
