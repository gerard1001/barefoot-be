module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'tripComments',
      [
        {
          user_id: 1,
          trip_id: 3,
          comment:
            'this trip of to day was awesome and it has to happen all the time',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 1,
          trip_id: 3,
          comment: 'ttrip going in UK was like an educative experience',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 1,
          trip_id: 3,
          comment: 'trip rusizi to giseny is very awesome',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 3,
          trip_id: 2,
          comment: 'trip rubavu nyagatare is a very long journey',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 1,
          trip_id: 3,
          comment: 'trip kigali musanze is very awesome',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tripComments', null, {});
  }
};
