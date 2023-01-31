module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('Bookings', [
      {
        user_id: 4,
        checkinDate: new Date('2022-03-25').toISOString(),
        checkoutDate: new Date('2022-03-26').toISOString(),
        status: 'PENDING',
        room_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 6,
        checkinDate: new Date('2022-03-25').toISOString(),
        checkoutDate: new Date('2022-03-27').toISOString(),
        status: 'PENDING',
        room_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 7,
        checkinDate: new Date('2022-03-25').toISOString(),
        checkoutDate: new Date('2022-03-27').toISOString(),
        status: 'PENDING',
        room_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 2,
        checkinDate: new Date('2022-03-25').toISOString(),
        checkoutDate: new Date('2022-03-27').toISOString(),
        status: 'PENDING',
        room_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 4,
        checkinDate: new Date('2022-03-25').toISOString(),
        checkoutDate: new Date('2022-03-26').toISOString(),
        status: 'APPROVED',
        room_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 4,
        checkinDate: new Date('2022-03-25').toISOString(),
        checkoutDate: new Date('2022-03-26').toISOString(),
        status: 'PENDING',
        room_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 4,
        checkinDate: new Date('2022-03-25').toISOString(),
        checkoutDate: new Date('2022-03-26').toISOString(),
        status: 'PENDING',
        room_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 4,
        checkinDate: new Date('2022-03-25').toISOString(),
        checkoutDate: new Date('2022-03-26').toISOString(),
        status: 'PENDING',
        room_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('Bookings', null, {})
};
