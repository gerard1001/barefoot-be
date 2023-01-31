module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('arrivalLocations', [
      {
        accommodation_id: 1,
        days: 3,
        TripId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 2,
        days: 3,
        TripId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 1,
        days: 3,
        TripId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 1,
        days: 3,
        TripId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accommodation_id: 3,
        days: 3,
        TripId: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('arrivalLocations', null, {});
  }
};
